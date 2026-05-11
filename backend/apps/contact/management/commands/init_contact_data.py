from django.core.management.base import BaseCommand
from apps.contact.models import (
    ContactHeroSection, ContactChannel, BusinessHour, SocialLink,
    ContactFormSettings, MapSection, ContactPageSettings
)

class Command(BaseCommand):
    help = 'Initialize contact page data'

    def handle(self, *args, **options):
        # Create Hero Section
        hero, created = ContactHeroSection.objects.get_or_create(
            id=1,
            defaults={
                'badge_text': "We're here for you",
                'title_line_1': "Let's Start",
                'title_highlight': "a Conversation",
                'subtitle': "Questions about an order, a product, or want to become an artisan partner? Our dedicated team is ready to help — fast, friendly, and from the heart.",
                'response_pills': [
                    "Avg. reply in 3 hrs",
                    "98% satisfaction rate",
                    "Secure & confidential"
                ],
                'quick_links': [
                    {"icon": "Phone", "text": "Call Now", "link": "tel:+923451234567"},
                    {"icon": "Mail", "text": "Email Us", "link": "mailto:support@gilgitbazaar.com"},
                    {"icon": "Send", "text": "Send Message", "link": "#form"}
                ],
                'hero_cards': [
                    {"icon": "Phone", "title": "Call Us", "detail": "+92 345 1234567", "sub": "Mon–Sat, 9AM – 6PM PST"},
                    {"icon": "Mail", "title": "Email Us", "detail": "support@gilgitbazaar.com", "sub": "Response within 24 hours"},
                    {"icon": "MapPin", "title": "Visit Us", "detail": "Gilgit-Baltistan, Pakistan", "sub": "Hunza · Skardu · Gilgit"}
                ],
                'online_indicator_text': "Support team is online now — ready to help",
                'online_indicator_highlight': "online now",
                'is_active': True
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Hero: {"Created" if created else "Exists"}'))

        # Create Contact Channels
        channels_data = [
            {'icon_name': 'Phone', 'title': 'Call Us', 'detail': '+92 345 1234567', 'subtitle': 'Mon–Sat, 9AM – 6PM PST', 'href': 'tel:+923451234567', 'order': 1},
            {'icon_name': 'Mail', 'title': 'Email Us', 'detail': 'support@gilgitbazaar.com', 'subtitle': 'Response within 24 hours', 'href': 'mailto:support@gilgitbazaar.com', 'order': 2},
            {'icon_name': 'MapPin', 'title': 'Visit Us', 'detail': 'Gilgit-Baltistan, Pakistan', 'subtitle': 'Hunza · Skardu · Gilgit', 'href': '#map', 'order': 3},
        ]
        
        for channel_data in channels_data:
            channel, created = ContactChannel.objects.get_or_create(
                title=channel_data['title'],
                defaults=channel_data
            )
            self.stdout.write(self.style.SUCCESS(f'Channel {channel.title}: {"Created" if created else "Exists"}'))

        # Create Business Hours
        hours_data = [
            {'day': 'Monday – Friday', 'time': '9:00 AM – 6:00 PM', 'status': 'open', 'order': 1},
            {'day': 'Saturday', 'time': '10:00 AM – 4:00 PM', 'status': 'open', 'order': 2},
            {'day': 'Sunday', 'time': 'Closed', 'status': 'closed', 'order': 3},
        ]
        
        for hour_data in hours_data:
            hour, created = BusinessHour.objects.get_or_create(
                day=hour_data['day'],
                defaults=hour_data
            )
            self.stdout.write(self.style.SUCCESS(f'Hour {hour.day}: {"Created" if created else "Exists"}'))

        # Create Social Links
        social_data = [
            {'platform': 'FB', 'label': 'Facebook', 'url': 'https://facebook.com/gilgitbazaar', 'icon_display': 'FB', 'order': 1},
            {'platform': 'IG', 'label': 'Instagram', 'url': 'https://instagram.com/gilgitbazaar', 'icon_display': 'IG', 'order': 2},
            {'platform': 'TW', 'label': 'Twitter', 'url': 'https://twitter.com/gilgitbazaar', 'icon_display': 'TW', 'order': 3},
            {'platform': 'YT', 'label': 'YouTube', 'url': 'https://youtube.com/gilgitbazaar', 'icon_display': 'YT', 'order': 4},
        ]
        
        for social_data_item in social_data:
            social, created = SocialLink.objects.get_or_create(
                platform=social_data_item['platform'],
                defaults=social_data_item
            )
            self.stdout.write(self.style.SUCCESS(f'Social {social.label}: {"Created" if created else "Exists"}'))

        # Create Form Settings
        form_settings, created = ContactFormSettings.objects.get_or_create(
            id=1,
            defaults={
                'section_eyebrow': 'Message Us',
                'title_prefix': 'Send a',
                'title_highlight': 'Message',
                'subtitle': 'Fill out the form below and our team will get back to you within 24 hours.',
                'subject_types': ['General Inquiry', 'Order Support', 'Partnership', 'Artisan Program', 'Press'],
                'name_label': 'Full Name',
                'email_label': 'Email Address',
                'subject_label': 'Subject',
                'message_label': 'Message',
                'name_placeholder': 'e.g. Ahmed Raza',
                'email_placeholder': 'hello@example.com',
                'subject_placeholder': '{type} — describe briefly',
                'message_placeholder': 'Tell us exactly how we can help you…',
                'max_message_length': 500,
                'privacy_text': 'Your data is protected and will never be shared with third parties.',
                'button_default_text': 'Send Message',
                'button_loading_text': 'Sending your message…',
                'button_sent_text': 'Message Sent! ✓',
                'success_toast_message': "Message sent! We'll get back to you within 24 hours.",
                'is_active': True
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Form Settings: {"Created" if created else "Exists"}'))

        # Create Map Settings
        map_settings, created = MapSection.objects.get_or_create(
            id=1,
            defaults={
                'title_prefix': 'Find',
                'title_highlight': 'Us',
                'subtitle': 'Operating from the stunning highlands of northern Pakistan',
                'map_embed_url': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211174.78!2d74.3!3d35.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e649c0aa418e67%3A0x87b2ed80018aa1e8!2sGilgit-Baltistan%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s',
                'map_link_text': 'Open in Maps',
                'map_link_url': 'https://maps.google.com/?q=Gilgit-Baltistan,Pakistan',
                'map_footer_items': [
                    {"icon": "MapPin", "location": "Gilgit City", "label": "Main Office"},
                    {"icon": "MapPin", "location": "Hunza Valley", "label": "Artisan Hub"},
                    {"icon": "MapPin", "location": "Skardu", "label": "Fulfilment Centre"},
                    {"icon": "Clock", "hours": "Mon–Sat", "label": "9AM–6PM"}
                ],
                'is_active': True
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Map Settings: {"Created" if created else "Exists"}'))

        # Create Page Settings
        page_settings, created = ContactPageSettings.objects.get_or_create(
            id=1,
            defaults={
                'info_column_eyebrow': 'Contact',
                'info_column_title_prefix': 'Get in',
                'info_column_title_highlight': 'Touch',
                'info_column_subtitle': "Whether it's a question, feedback, or a fresh partnership idea — pick the channel that works best for you.",
                'hours_section_title': 'Business Hours',
                'social_section_title': 'Follow Us',
                'is_active': True
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Page Settings: {"Created" if created else "Exists"}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Contact page data initialized successfully!'))