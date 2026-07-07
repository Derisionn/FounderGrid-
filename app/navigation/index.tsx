import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/navigation/CustomTabBar';
import HomeScreen from '../screens/bottomNavigation/home';
import TimelineScreen from '../screens/bottomNavigation/timeline';
import ProfileScreen from '../screens/bottomNavigation/profile';
import NotificationsScreen from '../screens/bottomNavigation/notifications';
import AddPostScreen from '../screens/bottomNavigation/addPost';
import LoginScreen from '../screens/login/login';
import OtpScreen from '../screens/login/otp';
import SplashScreen from '../screens/splash/splashScreen';
import BasicInfoScreen from '../screens/profile/basicInfoScreen';
import SettingScreen from '../screens/settings/settingScreen';
import LeaderboardScreen from '../screens/leaderboard/leaderboardScreen';
import InboxScreen from '../screens/messages/inboxScreen';
import ChatScreen from '../screens/messages/chatScreen';
import CommentsScreen from '../screens/comments/commentsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Otp: { email: string };
  BasicInfo: undefined;
  TabNavigator: undefined;
  Settings: undefined;
  Leaderboard: undefined;
  Inbox: undefined;
  Chat: { conversationId: string };
  Comments: { postId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TabNavigator"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <BottomTab.Screen
        name="HomeScreenNavigator"
        component={HomeScreen}
      />
      <BottomTab.Screen
        name="TimelineScreenNavigator"
        component={TimelineScreen}
      />
      <BottomTab.Screen
        name="AddPostScreenNavigator"
        component={AddPostScreen}
      />
      <BottomTab.Screen
        name="NotificationsScreenNavigator"
        component={NotificationsScreen}
      />
      <BottomTab.Screen
        name="ProfileScreenNavigator"
        component={ProfileScreen}
      />
    </BottomTab.Navigator>
  );
}

export default Navigation;
