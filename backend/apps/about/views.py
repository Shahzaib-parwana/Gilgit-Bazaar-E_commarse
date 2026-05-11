from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    AboutHeroSection, StorySection, Value, Timeline, StatItem,
    TeamMember, ArtisanSpotlight, NewsletterSection, AboutPageSettings
)
from .serializers import (
    AboutHeroSectionSerializer, StorySectionSerializer, ValueSerializer,
    TimelineSerializer, StatItemSerializer, TeamMemberSerializer,
    ArtisanSpotlightSerializer, NewsletterSectionSerializer,
    AboutPageSettingsSerializer, AboutPageDataSerializer
)

class AboutPageDataView(APIView):
    """Get all data for the About page"""
    
    def get(self, request):
        try:
            hero = AboutHeroSection.objects.filter(is_active=True).first()
            story = StorySection.objects.filter(is_active=True).first()
            values = Value.objects.filter(is_active=True)
            timeline = Timeline.objects.filter(is_active=True)
            stats = StatItem.objects.filter(is_active=True)
            team = TeamMember.objects.filter(is_active=True)
            spotlight = ArtisanSpotlight.objects.filter(is_active=True).first()
            newsletter = NewsletterSection.objects.filter(is_active=True).first()
            settings = AboutPageSettings.objects.filter(is_active=True).first()
            
            data = {
                'hero': hero,
                'story': story,
                'values': values,
                'timeline': timeline,
                'stats': stats,
                'team': team,
                'spotlight': spotlight,
                'newsletter': newsletter,
                'settings': settings
            }
            
            serializer = AboutPageDataSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Individual CRUD views for each section
class HeroSectionView(APIView):
    def get(self, request):
        hero = AboutHeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = AboutHeroSectionSerializer(hero)
            return Response(serializer.data)
        return Response({'error': 'Hero section not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        hero = AboutHeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = AboutHeroSectionSerializer(hero, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Hero section not found'}, status=status.HTTP_404_NOT_FOUND)

class StorySectionView(APIView):
    def get(self, request):
        story = StorySection.objects.filter(is_active=True).first()
        if story:
            serializer = StorySectionSerializer(story)
            return Response(serializer.data)
        return Response({'error': 'Story section not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        story = StorySection.objects.filter(is_active=True).first()
        if story:
            serializer = StorySectionSerializer(story, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Story section not found'}, status=status.HTTP_404_NOT_FOUND)

class ValuesView(APIView):
    def get(self, request):
        values = Value.objects.filter(is_active=True).order_by('order')
        serializer = ValueSerializer(values, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ValueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValueDetailView(APIView):
    def get_object(self, pk):
        try:
            return Value.objects.get(pk=pk)
        except Value.DoesNotExist:
            return None
    
    def put(self, request, pk):
        value = self.get_object(pk)
        if value:
            serializer = ValueSerializer(value, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Value not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        value = self.get_object(pk)
        if value:
            value.delete()
            return Response({'message': 'Value deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Value not found'}, status=status.HTTP_404_NOT_FOUND)

class TimelineView(APIView):
    def get(self, request):
        timeline = Timeline.objects.filter(is_active=True).order_by('order')
        serializer = TimelineSerializer(timeline, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TimelineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TimelineDetailView(APIView):
    def get_object(self, pk):
        try:
            return Timeline.objects.get(pk=pk)
        except Timeline.DoesNotExist:
            return None
    
    def put(self, request, pk):
        timeline = self.get_object(pk)
        if timeline:
            serializer = TimelineSerializer(timeline, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Timeline item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        timeline = self.get_object(pk)
        if timeline:
            timeline.delete()
            return Response({'message': 'Timeline item deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Timeline item not found'}, status=status.HTTP_404_NOT_FOUND)

class StatsView(APIView):
    def get(self, request):
        stats = StatItem.objects.filter(is_active=True).order_by('order')
        serializer = StatItemSerializer(stats, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = StatItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StatDetailView(APIView):
    def get_object(self, pk):
        try:
            return StatItem.objects.get(pk=pk)
        except StatItem.DoesNotExist:
            return None
    
    def put(self, request, pk):
        stat = self.get_object(pk)
        if stat:
            serializer = StatItemSerializer(stat, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        stat = self.get_object(pk)
        if stat:
            stat.delete()
            return Response({'message': 'Stat deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)

class TeamView(APIView):
    def get(self, request):
        team = TeamMember.objects.filter(is_active=True).order_by('order')
        serializer = TeamMemberSerializer(team, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamDetailView(APIView):
    def get_object(self, pk):
        try:
            return TeamMember.objects.get(pk=pk)
        except TeamMember.DoesNotExist:
            return None
    
    def put(self, request, pk):
        team = self.get_object(pk)
        if team:
            serializer = TeamMemberSerializer(team, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Team member not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        team = self.get_object(pk)
        if team:
            team.delete()
            return Response({'message': 'Team member deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Team member not found'}, status=status.HTTP_404_NOT_FOUND)

class SpotlightView(APIView):
    def get(self, request):
        spotlight = ArtisanSpotlight.objects.filter(is_active=True).first()
        if spotlight:
            serializer = ArtisanSpotlightSerializer(spotlight)
            return Response(serializer.data)
        return Response({'error': 'Spotlight not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        spotlight = ArtisanSpotlight.objects.filter(is_active=True).first()
        if spotlight:
            serializer = ArtisanSpotlightSerializer(spotlight, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Spotlight not found'}, status=status.HTTP_404_NOT_FOUND)

class NewsletterView(APIView):
    def get(self, request):
        newsletter = NewsletterSection.objects.filter(is_active=True).first()
        if newsletter:
            serializer = NewsletterSectionSerializer(newsletter)
            return Response(serializer.data)
        return Response({'error': 'Newsletter section not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        newsletter = NewsletterSection.objects.filter(is_active=True).first()
        if newsletter:
            serializer = NewsletterSectionSerializer(newsletter, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Newsletter section not found'}, status=status.HTTP_404_NOT_FOUND)