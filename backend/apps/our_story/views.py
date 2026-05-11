from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import (
    HeroSection, IntroSection, Stat, VideoSection, 
    ArtisanStory, ProcessStep, CTASection, StorySettings
)
from .serializers import (
    HeroSectionSerializer, IntroSectionSerializer, StatSerializer,
    VideoSectionSerializer, ArtisanStorySerializer, ProcessStepSerializer,
    CTASectionSerializer, StorySettingsSerializer, OurStoryDataSerializer
)

class OurStoryDataView(APIView):
    """Get all data for the Our Story page"""
    
    def get(self, request):
        try:
            hero = HeroSection.objects.filter(is_active=True).first()
            intro = IntroSection.objects.filter(is_active=True).first()
            stats = Stat.objects.filter(is_active=True)
            video = VideoSection.objects.filter(is_active=True).first()
            stories = ArtisanStory.objects.filter(is_active=True)
            process_steps = ProcessStep.objects.filter(is_active=True)
            cta = CTASection.objects.filter(is_active=True).first()
            settings = StorySettings.objects.filter(is_active=True).first()
            
            data = {
                'hero': hero,
                'intro': intro,
                'stats': stats,
                'video': video,
                'stories': stories,
                'process_steps': process_steps,
                'cta': cta,
                'settings': settings
            }
            
            serializer = OurStoryDataSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class HeroSectionView(APIView):
    """CRUD operations for Hero Section"""
    
    def get(self, request):
        hero = HeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = HeroSectionSerializer(hero)
            return Response(serializer.data)
        return Response({'error': 'No active hero section found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = HeroSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        hero = HeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = HeroSectionSerializer(hero, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Hero section not found'}, status=status.HTTP_404_NOT_FOUND)

class IntroSectionView(APIView):
    """CRUD operations for Intro Section"""
    
    def get(self, request):
        intro = IntroSection.objects.filter(is_active=True).first()
        if intro:
            serializer = IntroSectionSerializer(intro)
            return Response(serializer.data)
        return Response({'error': 'No active intro section found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = IntroSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        intro = IntroSection.objects.filter(is_active=True).first()
        if intro:
            serializer = IntroSectionSerializer(intro, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Intro section not found'}, status=status.HTTP_404_NOT_FOUND)

class StatsView(APIView):
    """CRUD operations for Statistics"""
    
    def get(self, request):
        stats = Stat.objects.filter(is_active=True).order_by('order')
        serializer = StatSerializer(stats, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = StatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StatDetailView(APIView):
    """Individual stat CRUD operations"""
    
    def get_object(self, pk):
        try:
            return Stat.objects.get(pk=pk)
        except Stat.DoesNotExist:
            return None
    
    def get(self, request, pk):
        stat = self.get_object(pk)
        if stat:
            serializer = StatSerializer(stat)
            return Response(serializer.data)
        return Response({'error': 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        stat = self.get_object(pk)
        if stat:
            serializer = StatSerializer(stat, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        stat = self.get_object(pk)
        if stat:
            stat.delete()
            return Response({'message': 'Stat deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Stat not found'}, status=status.HTTP_404_NOT_FOUND)

class VideoSectionView(APIView):
    """CRUD operations for Video Section"""
    
    def get(self, request):
        video = VideoSection.objects.filter(is_active=True).first()
        if video:
            serializer = VideoSectionSerializer(video)
            return Response(serializer.data)
        return Response({'error': 'No active video section found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = VideoSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        video = VideoSection.objects.filter(is_active=True).first()
        if video:
            serializer = VideoSectionSerializer(video, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Video section not found'}, status=status.HTTP_404_NOT_FOUND)

class ArtisanStoriesView(APIView):
    """CRUD operations for Artisan Stories"""
    
    def get(self, request):
        stories = ArtisanStory.objects.filter(is_active=True).order_by('order')
        serializer = ArtisanStorySerializer(stories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ArtisanStorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArtisanStoryDetailView(APIView):
    """Individual story CRUD operations"""
    
    def get_object(self, pk):
        try:
            return ArtisanStory.objects.get(pk=pk)
        except ArtisanStory.DoesNotExist:
            return None
    
    def get(self, request, pk):
        story = self.get_object(pk)
        if story:
            serializer = ArtisanStorySerializer(story)
            return Response(serializer.data)
        return Response({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        story = self.get_object(pk)
        if story:
            serializer = ArtisanStorySerializer(story, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        story = self.get_object(pk)
        if story:
            story.delete()
            return Response({'message': 'Story deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)

class ProcessStepsView(APIView):
    """CRUD operations for Process Steps"""
    
    def get(self, request):
        steps = ProcessStep.objects.filter(is_active=True).order_by('order')
        serializer = ProcessStepSerializer(steps, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProcessStepSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProcessStepDetailView(APIView):
    """Individual process step CRUD operations"""
    
    def get_object(self, pk):
        try:
            return ProcessStep.objects.get(pk=pk)
        except ProcessStep.DoesNotExist:
            return None
    
    def get(self, request, pk):
        step = self.get_object(pk)
        if step:
            serializer = ProcessStepSerializer(step)
            return Response(serializer.data)
        return Response({'error': 'Process step not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        step = self.get_object(pk)
        if step:
            serializer = ProcessStepSerializer(step, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Process step not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        step = self.get_object(pk)
        if step:
            step.delete()
            return Response({'message': 'Process step deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Process step not found'}, status=status.HTTP_404_NOT_FOUND)

class CTASectionView(APIView):
    """CRUD operations for CTA Section"""
    
    def get(self, request):
        cta = CTASection.objects.filter(is_active=True).first()
        if cta:
            serializer = CTASectionSerializer(cta)
            return Response(serializer.data)
        return Response({'error': 'No active CTA section found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = CTASectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        cta = CTASection.objects.filter(is_active=True).first()
        if cta:
            serializer = CTASectionSerializer(cta, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'CTA section not found'}, status=status.HTTP_404_NOT_FOUND)