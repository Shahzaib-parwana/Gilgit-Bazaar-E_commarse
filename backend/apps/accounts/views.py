from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .serializers import (
    UserRegistrationSerializer, UserSerializer, 
    UserProfileUpdateSerializer, ChangePasswordSerializer
    
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)


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

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })


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
    
    


# class PasswordResetRequestView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         serializer = PasswordResetRequestSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         email = serializer.validated_data['email']
#         user = User.objects.get(email=email)
        
#         # Generate reset token
#         token = default_token_generator.make_token(user)
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
        
#         # Create reset URL
#         reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
#         # Send email
#         from apps.notifications.tasks import send_password_reset_email
#         send_password_reset_email.delay(user.id, reset_url)
        
#         return Response({
#             'message': 'Password reset email has been sent.'
#         }, status=status.HTTP_200_OK)


# apps/auth/views.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

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
            # Try multiple template names
            template_names = [
                'emails/password_reset_simple.html',  # New simple template
                'emails/password_reset.html',   # Original template
                'password_reset_email.html',           # Fallback
            ]
            
            html_message = None
            for template_name in template_names:
                try:
                    html_message = render_to_string(template_name, {
                        'user': user,
                        'reset_url': reset_url,
                        'site_name': 'Gilgit Bazaar'
                    })
                    break  # Success, exit loop
                except Exception as e:
                    print(f"Template {template_name} not found: {e}")
                    continue
            
            if not html_message:
                # Ultimate fallback - plain text email
                plain_message = f"""
                Password Reset Request
                
                Hi {user.get_full_name() or user.email},
                
                Click the link below to reset your password:
                {reset_url}
                
                This link will expire in 24 hours.
                
                If you didn't request this, please ignore this email.
                """
                
                send_mail(
                    'Password Reset Request - Gilgit Bazaar',
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            else:
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
            
            # In development, return the reset URL
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
    