from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from datetime import timedelta
from .serializers import (
    UserRegistrationSerializer, UserSerializer, UserProfileUpdateSerializer, 
    ChangePasswordSerializer, PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer, VerifyEmailSerializer, 
    ResendVerificationCodeSerializer, GoogleAuthSerializer
)
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import json

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate and send verification code
        verification_code = user.verification_code
        
        # Send verification email
        self.send_verification_email(user, verification_code)
        
        return Response({
            'message': 'Registration successful. Please verify your email.',
            'email': user.email,
            'requires_verification': True
        }, status=status.HTTP_201_CREATED)
    
    def send_verification_email(self, user, verification_code):
        """Send verification code to user's email"""
        try:
            subject = 'Verify Your Email - Gilgit Bazaar'
            html_message = render_to_string('emails/verification_code.html', {
                'user': user,
                'verification_code': verification_code,
                'site_name': 'Gilgit Bazaar',
                'validity_hours': 24
            })
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send verification email: {e}")


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Verify the user
        user.is_verified = True
        user.verification_code = None
        user.verification_code_created_at = None
        user.save()
        
        # Create token for the user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Email verified successfully.',
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_200_OK)


class ResendVerificationCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate new verification code
        user.generate_verification_code()
        user.verification_code_created_at = timezone.now()
        user.save()
        
        # Send new verification email
        self.send_verification_email(user, user.verification_code)
        
        return Response({
            'message': 'New verification code sent successfully.'
        }, status=status.HTTP_200_OK)
    
    def send_verification_email(self, user, verification_code):
        """Send verification code to user's email"""
        try:
            subject = 'New Verification Code - Gilgit Bazaar'
            html_message = render_to_string('emails/verification_code.html', {
                'user': user,
                'verification_code': verification_code,
                'site_name': 'Gilgit Bazaar',
                'validity_hours': 24
            })
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send verification email: {e}")


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if email is verified
        if not user.is_verified:
            return Response(
                {'error': 'Please verify your email before logging in.', 'requires_verification': True, 'email': user.email},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        id_token_str = serializer.validated_data['id_token']
        
        try:
            # Verify Google token using the Client ID
            # This is where the CLIENT SECRET is used! (Google's library handles it)
            google_client_id = settings.GOOGLE_CLIENT_ID 
            info = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                google_client_id
            )
            
            # Check if token issuer is correct
            if info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response(
                    {'error': 'Invalid token issuer'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get user info from verified token
            email = info.get('email')
            first_name = info.get('given_name', '')
            last_name = info.get('family_name', '')
            google_id = info.get('sub')
            
            if not email:
                return Response(
                    {'error': 'Email not provided by Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user exists
            user = User.objects.filter(email=email).first()
            
            if user:
                # User exists, check if verified
                if not user.is_verified:
                    # Mark as verified for Google users
                    user.is_verified = True
                    user.save()
                
                # Update Google ID if not set
                if not user.google_id:
                    user.google_id = google_id
                    user.save()
            else:
                # Create new user
                username = email.split('@')[0]
                # Ensure unique username
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                user = User.objects.create(
                    email=email,
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    google_id=google_id,
                    is_verified=True,  # Google users are auto-verified
                    is_active=True
                )
                user.set_unusable_password()  # No password for Google users
                user.save()
            
            # Create or get token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'is_new': not bool(user.last_login) if user else True
            })
            
        except ValueError as e:
            # Invalid token
            print(f"Token verification failed: {str(e)}")
            return Response(
                {'error': f'Invalid Google token: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Google authentication error: {str(e)}")
            return Response(
                {'error': f'Google authentication failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileUpdateSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password': ['Wrong password.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.data.get('new_password'))
            user.save()
            
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create reset URL
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        try:
            html_message = render_to_string('emails/password_reset.html', {
                'user': user,
                'reset_url': reset_url,
                'site_name': 'Gilgit Bazaar'
            })
            plain_message = strip_tags(html_message)
            
            send_mail(
                'Password Reset Request - Gilgit Bazaar',
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Password reset email has been sent.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Email error details: {str(e)}")
            
            if settings.DEBUG:
                return Response({
                    'message': 'Password reset link generated (development mode)',
                    'reset_url': reset_url,
                    'email': user.email
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': f'Unable to send reset email: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password has been reset successfully.'
        }, status=status.HTTP_200_OK)
        
        