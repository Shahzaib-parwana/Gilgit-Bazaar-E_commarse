from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    ContactHeroSection, ContactChannel, BusinessHour, SocialLink,
    ContactFormSettings, MapSection, ContactMessage, ContactPageSettings
)
from .serializers import (
    ContactHeroSectionSerializer, ContactChannelSerializer, BusinessHourSerializer,
    SocialLinkSerializer, ContactFormSettingsSerializer, MapSectionSerializer,
    ContactMessageSerializer, ContactPageSettingsSerializer, ContactPageDataSerializer
)

class ContactPageDataView(APIView):
    """Get all data for the Contact page"""
    
    def get(self, request):
        try:
            hero = ContactHeroSection.objects.filter(is_active=True).first()
            channels = ContactChannel.objects.filter(is_active=True)
            hours = BusinessHour.objects.filter(is_active=True)
            social_links = SocialLink.objects.filter(is_active=True)
            form_settings = ContactFormSettings.objects.filter(is_active=True).first()
            map_settings = MapSection.objects.filter(is_active=True).first()
            settings = ContactPageSettings.objects.filter(is_active=True).first()
            
            data = {
                'hero': hero,
                'channels': channels,
                'hours': hours,
                'social_links': social_links,
                'form_settings': form_settings,
                'map_settings': map_settings,
                'settings': settings
            }
            
            serializer = ContactPageDataSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SubmitContactFormView(APIView):
    """Handle contact form submissions"""
    
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Message sent successfully!',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactMessagesView(APIView):
    """View all contact messages (admin only)"""
    
    def get(self, request):
        messages = ContactMessage.objects.all()
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        try:
            message = ContactMessage.objects.get(pk=pk)
            serializer = ContactMessageSerializer(message, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

# Individual CRUD views
class HeroSectionView(APIView):
    def get(self, request):
        hero = ContactHeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = ContactHeroSectionSerializer(hero)
            return Response(serializer.data)
        return Response({'error': 'Hero section not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        hero = ContactHeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = ContactHeroSectionSerializer(hero, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Hero section not found'}, status=status.HTTP_404_NOT_FOUND)

class ChannelsView(APIView):
    def get(self, request):
        channels = ContactChannel.objects.filter(is_active=True).order_by('order')
        serializer = ContactChannelSerializer(channels, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ContactChannelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChannelDetailView(APIView):
    def get_object(self, pk):
        try:
            return ContactChannel.objects.get(pk=pk)
        except ContactChannel.DoesNotExist:
            return None
    
    def put(self, request, pk):
        channel = self.get_object(pk)
        if channel:
            serializer = ContactChannelSerializer(channel, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Channel not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        channel = self.get_object(pk)
        if channel:
            channel.delete()
            return Response({'message': 'Channel deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Channel not found'}, status=status.HTTP_404_NOT_FOUND)

class HoursView(APIView):
    def get(self, request):
        hours = BusinessHour.objects.filter(is_active=True).order_by('order')
        serializer = BusinessHourSerializer(hours, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BusinessHourSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HourDetailView(APIView):
    def get_object(self, pk):
        try:
            return BusinessHour.objects.get(pk=pk)
        except BusinessHour.DoesNotExist:
            return None
    
    def put(self, request, pk):
        hour = self.get_object(pk)
        if hour:
            serializer = BusinessHourSerializer(hour, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Hour not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        hour = self.get_object(pk)
        if hour:
            hour.delete()
            return Response({'message': 'Hour deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Hour not found'}, status=status.HTTP_404_NOT_FOUND)

class SocialLinksView(APIView):
    def get(self, request):
        links = SocialLink.objects.filter(is_active=True).order_by('order')
        serializer = SocialLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SocialLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SocialLinkDetailView(APIView):
    def get_object(self, pk):
        try:
            return SocialLink.objects.get(pk=pk)
        except SocialLink.DoesNotExist:
            return None
    
    def put(self, request, pk):
        link = self.get_object(pk)
        if link:
            serializer = SocialLinkSerializer(link, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Social link not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        link = self.get_object(pk)
        if link:
            link.delete()
            return Response({'message': 'Social link deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Social link not found'}, status=status.HTTP_404_NOT_FOUND)

class FormSettingsView(APIView):
    def get(self, request):
        settings = ContactFormSettings.objects.filter(is_active=True).first()
        if settings:
            serializer = ContactFormSettingsSerializer(settings)
            return Response(serializer.data)
        return Response({'error': 'Form settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        settings = ContactFormSettings.objects.filter(is_active=True).first()
        if settings:
            serializer = ContactFormSettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Form settings not found'}, status=status.HTTP_404_NOT_FOUND)

class MapSettingsView(APIView):
    def get(self, request):
        settings = MapSection.objects.filter(is_active=True).first()
        if settings:
            serializer = MapSectionSerializer(settings)
            return Response(serializer.data)
        return Response({'error': 'Map settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        settings = MapSection.objects.filter(is_active=True).first()
        if settings:
            serializer = MapSectionSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Map settings not found'}, status=status.HTTP_404_NOT_FOUND)