import common from './common.json';
import authLogin from './auth/login.json';
import authRegister from './auth/register.json';
import authLayout from './auth/layout.json';
import authPassword from './auth/password.json';
import dashboardNavigation from './dashboard/navigation.json';
import dashboardEvents from './dashboard/events.json';
import dashboardEventCreation from './dashboard/eventCreation.json';
import dashboardGuestApp from './dashboard/guestApp.json';
import dashboardThemes from './dashboard/themes.json';
import dashboardPhotos from './dashboard/photos.json';
import dashboardAnalytics from './dashboard/analytics.json';
import dashboardSettings from './dashboard/settings.json';
import dashboardUser from './dashboard/user.json';
import slideshowControls from './slideshow/controls.json';
import slideshowSettings from './slideshow/settings.json';
import slideshowDisplay from './slideshow/display.json';

export default {
  common,
  auth: {
    login: authLogin,
    register: authRegister,
    layout: authLayout,
    password: authPassword,
  },
  dashboard: {
    navigation: dashboardNavigation,
    events: dashboardEvents,
    eventCreation: dashboardEventCreation,
    guestApp: dashboardGuestApp,
    themes: dashboardThemes,
    photos: dashboardPhotos,
    analytics: dashboardAnalytics,
    settings: dashboardSettings,
    user: dashboardUser,
  },
  slideshow: {
    controls: slideshowControls,
    settings: slideshowSettings,
    display: slideshowDisplay,
  },
};
