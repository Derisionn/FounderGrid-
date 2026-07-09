import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { scale } from '../../helpers/scaler';
import { texts } from '../../styles/texts';
import { useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

const SplashScreen = () => {
  const navigation: NavigationProp<any> = useNavigation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      navigation.reset({
        index: 0,
        routes: [{ name: data.session ? 'TabNavigator' : 'Login' }],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.Others.white,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: scale(24),
        }}
      >
        <Text style={[texts.heading.heading1, { color: colors.primary[600] }]}>
          FounderGrid
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
