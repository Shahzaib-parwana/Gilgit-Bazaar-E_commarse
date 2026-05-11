# site_settings/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
from .models import AnnouncementBar, FlashSale, SiteSetting
from .serializers import AnnouncementBarSerializer, FlashSaleSerializer, SiteSettingSerializer

class ActiveAnnouncementsListView(generics.ListAPIView):
    """Get all active announcements"""
    serializer_class = AnnouncementBarSerializer
    queryset = AnnouncementBar.objects.filter(is_active=True)


class ActiveFlashSaleView(generics.RetrieveAPIView):
    """Get the currently active flash sale"""
    serializer_class = FlashSaleSerializer
    
    def get_object(self):
        now = timezone.now()
        # Get active flash sale that is currently running
        flash_sale = FlashSale.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        ).first()
        return flash_sale


class AllFlashSalesListView(generics.ListAPIView):
    """Get all flash sales (for admin)"""
    serializer_class = FlashSaleSerializer
    queryset = FlashSale.objects.all()


class SiteSettingView(generics.RetrieveAPIView):
    """Get a specific site setting by key"""
    serializer_class = SiteSettingSerializer
    
    def get(self, request, key):
        try:
            setting = SiteSetting.objects.get(key=key, is_active=True)
            serializer = self.get_serializer(setting)
            return Response(serializer.data)
        except SiteSetting.DoesNotExist:
            return Response({'error': 'Setting not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_home_banners(request):
    """Get all data needed for home page banners"""
    announcements = AnnouncementBar.objects.filter(is_active=True).order_by('order')
    current_flash_sale = FlashSale.objects.filter(
        is_active=True,
        start_date__lte=timezone.now(),
        end_date__gte=timezone.now()
    ).first()
    
    return Response({
        'announcements': AnnouncementBarSerializer(announcements, many=True).data,
        'flash_sale': FlashSaleSerializer(current_flash_sale).data if current_flash_sale else None
    })