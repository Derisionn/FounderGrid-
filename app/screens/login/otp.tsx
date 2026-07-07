import type { StackScreenProps } from '@react-navigation/stack';
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { scale } from '../../helpers/scaler';
import { texts } from '../../styles/texts';
import { useRef, useState, useEffect, useCallback } from 'react';
import Chevron from '../../../assets/icons/Chevron';

import type { RootStackParamList } from '../../navigation';
import { supabase } from '../../lib/supabase';

type OtpScreenProps = StackScreenProps<RootStackParamList, 'Otp'>;

const OtpScreen = ({ navigation, route }: OtpScreenProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // Supabase enforces a 60s cooldown between OTP emails for the same address.
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { email } = route.params;

  const handleVerifyWith = useCallback(
    async (token: string) => {
      if (token.length < 6 || verifying) return;
      setVerifying(true);
      setError(null);
      try {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        });
        if (verifyError) {
          setError('Invalid or expired code. Try again.');
          return;
        }
        navigation.reset({ index: 0, routes: [{ name: 'BasicInfo' }] });
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setVerifying(false);
      }
    },
    [email, verifying, navigation],
  );

  const handleVerify = useCallback(
    () => handleVerifyWith(otp.join('')),
    [otp, handleVerifyWith],
  );

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setError(null);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (resendError) {
      setError(resendError.message);
      return;
    }
    setTimer(60);
  }, [timer, email]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length === 1 && !isNaN(Number(text))) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (error) setError(null);

      if (index < otp.length - 1) {
        inputs.current[index + 1]?.focus();
      } else if (newOtp.every(d => d !== '')) {
        // Last digit entered → auto-submit.
        inputs.current[index]?.blur();
        handleVerifyWith(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (
    { nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary[200] }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: scale(16),
          backgroundColor: colors.primary[200],
          marginTop: scale(32),
        }}
      >
        <Pressable
          style={{
            backgroundColor: colors.primary[300],
            borderRadius: scale(16),
            width: scale(24),
            height: scale(24),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Chevron direction="left" width={scale(10)} height={scale(10)} />
        </Pressable>
        <Text
          style={[
            texts.heading.heading3,
            { color: colors.Greyscale[0], marginTop: scale(32) },
          ]}
        >
          OTP{'\n'}Verification
        </Text>
        <Text
          style={[texts.body.medium.medium, { color: colors.primary[300] }]}
        >
          A 6-digit code has been sent to {email}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: scale(8),
            marginTop: scale(32),
            marginBottom: scale(16),
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={[
                {
                  ...texts.body.small.regular,
                  width: scale(50),
                  height: scale(50),
                  borderRadius: scale(20),
                  // borderWidth: scale(1),
                  // borderColor: colors.Greyscale[300],
                  backgroundColor: colors.Others.white,
                  color: colors.Greyscale[900],
                  textAlign: 'center',
                  paddingVertical: 'auto',
                },
                digit !== '' && { borderColor: colors.primary[600] },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
            />
          ))}
        </View>
        <Text
          style={[
            texts.body.medium.medium,
            {
              color: colors.Greyscale[0],
              textAlign: 'left',
            },
          ]}
        >
          {`${String(Math.floor(timer / 60)).padStart(2, '0')}: ${String(
            timer % 60,
          ).padStart(2, '0')}`}
        </Text>
        <View
          style={{ flexDirection: 'row', gap: scale(16), marginTop: scale(16) }}
        >
          <Text
            style={[texts.body.small.regular, { color: colors.primary[400] }]}
          >
            Didn't get it?
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text
              style={[
                texts.body.small.regular,
                {
                  color: colors.primary[400],
                  textDecorationLine: 'underline',
                  opacity: timer > 0 ? 0.5 : 1,
                },
              ]}
            >
              Resend code
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text
            style={[
              texts.body.small.regular,
              { color: colors.Alert.Error[100], marginTop: scale(16) },
            ]}
          >
            {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.some(d => d === '') || verifying}
          activeOpacity={0.85}
          style={{
            marginTop: scale(28),
            backgroundColor: colors.primary[600],
            borderRadius: scale(100),
            paddingVertical: scale(16),
            alignItems: 'center',
            opacity: otp.some(d => d === '') || verifying ? 0.5 : 1,
          }}
        >
          <Text
            style={[texts.body.medium.medium, { color: colors.Others.white }]}
          >
            {verifying ? 'Verifying…' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;
