import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import type { StackScreenProps } from '@react-navigation/stack';
import { colors } from '../../styles/colors';
import { scale } from '../../helpers/scaler';
import { texts } from '../../styles/texts';
import { CustomButton } from '../../components/base/button/customButton';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import type { RootStackParamList } from '../../navigation';
import PasswordVisibleEye from '../../../assets/icons/PasswordVisibleEye';
import PasswordHiddenEye from '../../../assets/icons/PasswordHiddenEye';
import Calendar from '../../../assets/icons/Calendar';
import { supabase } from '../../lib/supabase';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

type Mode = 'signin' | 'signup';
const TOTAL_STEPS = 5;
const MIN_AGE = 13;
const MAX_AGE = 100;

// Returns a valid Date or null. Rejects invalid days like 31/02/2000.
const parseDob = (s: string): Date | null => {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = parseInt(dd, 10);
  const mo = parseInt(mm, 10);
  const y = parseInt(yyyy, 10);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  if (date > new Date()) return null;
  return date;
};

const calcAge = (date: Date): number => {
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const beforeBirthday =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());
  if (beforeBirthday) age--;
  return age;
};

// Local Date → ISO calendar date (YYYY-MM-DD), avoiding UTC off-by-one drift.
const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Date → DD/MM/YYYY (the display/string format the rest of the flow uses).
const formatDobFromDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
};

// Picker bounds derived from the age limits so users can't scroll to an
// impossible birth date.
const TODAY = new Date();
const MIN_PICKER_DATE = new Date(
  TODAY.getFullYear() - MAX_AGE,
  TODAY.getMonth(),
  TODAY.getDate(),
);
const MAX_PICKER_DATE = new Date(
  TODAY.getFullYear() - MIN_AGE,
  TODAY.getMonth(),
  TODAY.getDate(),
);

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState(1);

  const scrollRef = useRef<ScrollView>(null);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, e => {
      setKbHeight(e.endCoordinates.height);
      // Wait for layout, then scroll the active form section into view.
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    });
    const hideSub = Keyboard.addListener(hideEvt, () => setKbHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Sign-in
  const [identifier, setIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPwd, setShowSignInPwd] = useState(false);

  // Sign-up (5 steps)
  const [contact, setContact] = useState(''); // phone OR email
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPwd, setShowSignUpPwd] = useState(false);
  const [dob, setDob] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const [showDobPicker, setShowDobPicker] = useState(false);

  // Async auth state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setStep(1);
    setError(null);
  };

  const isEmail = contact.includes('@');
  const isContactValid = isEmail
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())
    : contact.trim().length >= 7;

  const dobDate = parseDob(dob);
  const dobAge = dobDate ? calcAge(dobDate) : null;
  const isDobValid = dobAge != null && dobAge >= MIN_AGE && dobAge <= MAX_AGE;

  const openDobPicker = () => {
    Keyboard.dismiss();
    setShowDobPicker(true);
  };

  const onChangeDob = (event: DateTimePickerEvent, selected?: Date) => {
    // Android shows a modal dialog that must be dismissed on every event;
    // iOS renders inline and is closed via the "Done" button below.
    if (Platform.OS === 'android') setShowDobPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setDob(formatDobFromDate(selected));
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        // Email-only sign-up for now; phone support is a follow-up.
        return isEmail && isContactValid;
      case 2:
        return signUpPassword.length >= 6;
      case 3:
        return isDobValid;
      case 4:
        return fullName.trim().length > 0;
      case 5:
        return username.trim().length > 0;
      default:
        return false;
    }
  };

  const onNext = async () => {
    if (!canAdvance() || submitting) return;
    setError(null);
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      return;
    }

    // Final step → create the account.
    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: contact.trim(),
        password: signUpPassword,
        options: {
          data: {
            username: username.trim(),
            full_name: fullName.trim(),
            dob: dobDate ? toIsoDate(dobDate) : '',
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      // No session means email confirmation is required → verify via OTP.
      if (!data.session) {
        navigation.navigate('Otp', { email: contact.trim() });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onBack = () => {
    if (step > 1) {
      setError(null);
      setStep(s => s - 1);
    }
  };

  const onSignIn = async () => {
    if (!identifier.trim() || !signInPassword || submitting) return;
    setError(null);
    if (!identifier.includes('@')) {
      setError('Sign in with your email for now.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password: signInPassword,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary[100] }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? scale(8) : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: scale(20),
            paddingBottom: kbHeight + scale(40),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
        >
          {/* ── Brand ───────────────────────────────────────── */}
          <View style={{ marginTop: scale(24), marginBottom: scale(20) }}>
            <Text
              style={[texts.heading.heading2, { color: colors.Greyscale[900] }]}
            >
              Foundora
            </Text>
            <Text
              style={[
                texts.heading.heading4,
                { color: colors.Greyscale[700], marginTop: scale(8) },
              ]}
            >
              {mode === 'signin'
                ? 'Welcome back'
                : 'Create your account'}
            </Text>
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500], marginTop: scale(6) },
              ]}
            >
              {mode === 'signin'
                ? 'Sign in to continue your founder journey.'
                : 'Learn from the leaders. Grow like one.'}
            </Text>
          </View>

          {/* ── Tab toggle ─────────────────────────────────── */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.Others.white,
              borderRadius: scale(100),
              padding: scale(4),
              borderWidth: 1,
              borderColor: colors.Greyscale[100],
              marginBottom: scale(24),
            }}
          >
            <TabPill
              label="Sign In"
              active={mode === 'signin'}
              onPress={() => switchMode('signin')}
            />
            <TabPill
              label="Sign Up"
              active={mode === 'signup'}
              onPress={() => switchMode('signup')}
            />
          </View>

          {/* ── Sign In ────────────────────────────────────── */}
          {mode === 'signin' && (
            <View>
              <FieldLabel text="Username, phone, or email" />
              <PrimaryInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Username, phone, or email"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <VSpacer height={scale(16)} />

              <FieldLabel text="Password" />
              <PasswordInput
                value={signInPassword}
                onChangeText={setSignInPassword}
                show={showSignInPwd}
                onToggleShow={() => setShowSignInPwd(s => !s)}
                placeholder="Enter your password"
              />

              <TouchableOpacity
                onPress={() => {}}
                style={{ alignSelf: 'flex-end', marginTop: scale(8) }}
              >
                <Text
                  style={[
                    texts.body.small.regular,
                    { color: colors.primary[500] },
                  ]}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>

              {error && <ErrorText text={error} />}

              <VSpacer height={scale(24)} />
              <CustomButton
                size="medium"
                type="primary"
                text={submitting ? 'Signing in…' : 'Sign In'}
                onPress={onSignIn}
                borderRadius={scale(100)}
                disabled={!identifier.trim() || !signInPassword || submitting}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: scale(20),
                }}
              >
                <Text
                  style={[
                    texts.body.small.regular,
                    { color: colors.Greyscale[600] },
                  ]}
                >
                  New here?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('signup')}>
                  <Text
                    style={[
                      texts.body.small.regular,
                      { color: colors.primary[500], fontWeight: '600' },
                    ]}
                  >
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Sign Up (multi-step) ───────────────────────── */}
          {mode === 'signup' && (
            <View>
              {/* Progress indicator */}
              <View style={{ marginBottom: scale(20) }}>
                <Text
                  style={[
                    texts.body.extraSmall.regular,
                    {
                      color: colors.Greyscale[500],
                      marginBottom: scale(8),
                      letterSpacing: 1,
                    },
                  ]}
                >
                  STEP {step} OF {TOTAL_STEPS}
                </Text>
                <View style={{ flexDirection: 'row', gap: scale(6) }}>
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <View
                      key={i}
                      style={{
                        flex: 1,
                        height: scale(4),
                        borderRadius: scale(2),
                        backgroundColor:
                          i + 1 <= step
                            ? colors.primary[500]
                            : colors.Greyscale[100],
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Step content */}
              {step === 1 && (
                <View>
                  <StepTitle
                    title="Contact info"
                    subtitle="We'll use this to keep your account secure."
                  />
                  <FieldLabel text="Email" />
                  <PrimaryInput
                    value={contact}
                    onChangeText={setContact}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {contact.length > 0 && !isEmail && (
                    <Text
                      style={[
                        texts.body.extraSmall.regular,
                        { color: colors.Greyscale[500], marginTop: scale(8) },
                      ]}
                    >
                      Email sign-up for now — phone support is coming soon.
                    </Text>
                  )}
                </View>
              )}

              {step === 2 && (
                <View>
                  <StepTitle
                    title="Set a password"
                    subtitle="Make it strong"
                  />
                  <FieldLabel text="Password" />
                  <PasswordInput
                    value={signUpPassword}
                    onChangeText={setSignUpPassword}
                    show={showSignUpPwd}
                    onToggleShow={() => setShowSignUpPwd(s => !s)}
                    placeholder="Create a password"
                  />
                  <View style={{ marginTop: scale(12), gap: scale(6) }}>
                    <PasswordRule
                      met={signUpPassword.length >= 6}
                      text="At least 6 characters"
                    />
                    <PasswordRule
                      met={/[A-Z]/.test(signUpPassword)}
                      text="Contains an uppercase letter"
                    />
                    <PasswordRule
                      met={/[0-9]/.test(signUpPassword)}
                      text="Contains a number"
                    />
                    <PasswordRule
                      met={/[^A-Za-z0-9]/.test(signUpPassword)}
                      text="Contains a symbol (e.g. ! @ # $)"
                    />
                  </View>
                </View>
              )}

              {step === 3 && (
                <View>
                  <StepTitle
                    title="Date of birth"
                    subtitle="So we can personalize your timeline."
                  />
                  <FieldLabel text="DOB" />
                  <DateField
                    value={dob}
                    onChangeText={setDob}
                    onPressPicker={openDobPicker}
                  />
                  <Text
                    style={[
                      texts.body.extraSmall.regular,
                      {
                        marginTop: scale(8),
                        color: !dob
                          ? colors.Greyscale[500]
                          : isDobValid
                          ? colors.Alert.Success[200]
                          : colors.Alert.Error[100],
                      },
                    ]}
                  >
                    {!dob
                      ? `Type it or tap the calendar to pick · You must be ${MIN_AGE}+ to sign up.`
                      : !dobDate
                      ? "That doesn't look like a valid date."
                      : dobAge != null && dobAge < MIN_AGE
                      ? `You must be at least ${MIN_AGE} years old.`
                      : dobAge != null && dobAge > MAX_AGE
                      ? "Please double-check your year of birth."
                      : `You're ${dobAge} years old. Looks good!`}
                  </Text>

                  {/* Android: native calendar dialog (self-dismissing) */}
                  {Platform.OS === 'android' && showDobPicker && (
                    <DateTimePicker
                      value={dobDate ?? MAX_PICKER_DATE}
                      mode="date"
                      display="default"
                      maximumDate={MAX_PICKER_DATE}
                      minimumDate={MIN_PICKER_DATE}
                      onChange={onChangeDob}
                    />
                  )}

                  {/* iOS: bottom-sheet spinner in a floating modal with a Done bar */}
                  {Platform.OS === 'ios' && (
                    <Modal
                      visible={showDobPicker}
                      transparent
                      animationType="slide"
                      onRequestClose={() => setShowDobPicker(false)}
                    >
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setShowDobPicker(false)}
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{ backgroundColor: colors.Others.white }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              borderBottomWidth: 1,
                              borderBottomColor: colors.Greyscale[100],
                              paddingHorizontal: scale(16),
                              paddingVertical: scale(12),
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => setShowDobPicker(false)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text
                                style={[
                                  texts.body.medium.medium,
                                  { color: colors.primary[500], fontWeight: '700' },
                                ]}
                              >
                                Done
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={dobDate ?? MAX_PICKER_DATE}
                            mode="date"
                            display="spinner"
                            maximumDate={MAX_PICKER_DATE}
                            minimumDate={MIN_PICKER_DATE}
                            onChange={onChangeDob}
                            themeVariant="light"
                            style={{ backgroundColor: colors.Others.white }}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </Modal>
                  )}
                </View>
              )}

              {step === 4 && (
                <View>
                  <StepTitle
                    title="What's your name?"
                    subtitle="This is how you'll appear to others."
                  />
                  <FieldLabel text="Full name" />
                  <PrimaryInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                </View>
              )}

              {step === 5 && (
                <View>
                  <StepTitle
                    title="Pick a username"
                    subtitle="Lowercase letters, numbers, and underscores only."
                  />
                  <FieldLabel text="Username" />
                  <PrimaryInput
                    value={username}
                    onChangeText={t =>
                      setUsername(t.toLowerCase().replace(/\s/g, ''))
                    }
                    placeholder="e.g. anmol_s"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}

              {/* Nav buttons */}
              <VSpacer height={scale(28)} />
              <View style={{ flexDirection: 'row', gap: scale(10) }}>
                {step > 1 && (
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      size="medium"
                      type="secondary"
                      text="Back"
                      onPress={onBack}
                      borderRadius={scale(100)}
                    />
                  </View>
                )}
                <View style={{ flex: step > 1 ? 2 : 1 }}>
                  <CustomButton
                    size="medium"
                    type="primary"
                    text={
                      step === TOTAL_STEPS
                        ? submitting
                          ? 'Creating…'
                          : 'Create account'
                        : 'Continue'
                    }
                    onPress={onNext}
                    borderRadius={scale(100)}
                    disabled={!canAdvance() || submitting}
                  />
                </View>
              </View>

              {error && <ErrorText text={error} />}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: scale(20),
                }}
              >
                <Text
                  style={[
                    texts.body.small.regular,
                    { color: colors.Greyscale[600] },
                  ]}
                >
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('signin')}>
                  <Text
                    style={[
                      texts.body.small.regular,
                      { color: colors.primary[500], fontWeight: '600' },
                    ]}
                  >
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Footer ─────────────────────────────────────── */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: scale(12),
            paddingHorizontal: scale(20),
          }}
        >
          <Text
            style={[
              texts.body.extraSmall.regular,
              { color: colors.Greyscale[500] },
            ]}
          >
            By continuing, you agree to our
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text
              style={[
                texts.body.extraSmall.regular,
                { color: colors.primary[500] },
              ]}
            >
              Terms of Use & Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// ─── Sub-components ────────────────────────────────────────────────────────────
const TabPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      flex: 1,
      paddingVertical: scale(10),
      alignItems: 'center',
      borderRadius: scale(100),
      backgroundColor: active ? colors.primary[500] : 'transparent',
    }}
  >
    <Text
      style={[
        texts.body.small.regular,
        {
          color: active ? colors.Others.white : colors.Greyscale[600],
          fontWeight: active ? '700' : '500',
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ErrorText = ({ text }: { text: string }) => (
  <Text
    style={[
      texts.body.small.regular,
      { color: colors.Alert.Error[100], marginTop: scale(16) },
    ]}
  >
    {text}
  </Text>
);

const FieldLabel = ({ text }: { text: string }) => (
  <Text
    style={[
      texts.body.small.regular,
      {
        color: colors.Greyscale[700],
        marginBottom: scale(6),
        fontWeight: '600',
      },
    ]}
  >
    {text}
  </Text>
);

const StepTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View style={{ marginBottom: scale(16) }}>
    <Text
      style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}
    >
      {title}
    </Text>
    <Text
      style={[
        texts.body.small.regular,
        { color: colors.Greyscale[500], marginTop: scale(4) },
      ]}
    >
      {subtitle}
    </Text>
  </View>
);

const PasswordRule = ({ met, text }: { met: boolean; text: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View
      style={{
        width: scale(16),
        height: scale(16),
        borderRadius: scale(8),
        backgroundColor: met
          ? colors.Alert.Success[100]
          : colors.Greyscale[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(8),
      }}
    >
      <Text
        style={{
          fontSize: scale(10),
          color: met ? colors.Others.white : colors.Greyscale[400],
          fontWeight: '700',
          lineHeight: scale(12),
        }}
      >
        {met ? '✓' : '•'}
      </Text>
    </View>
    <Text
      style={[
        texts.body.extraSmall.regular,
        {
          color: met ? colors.Greyscale[700] : colors.Greyscale[500],
          fontWeight: met ? '600' : '400',
        },
      ]}
    >
      {text}
    </Text>
  </View>
);

const inputStyle = {
  borderWidth: 1,
  borderColor: colors.Greyscale[200],
  borderRadius: scale(16),
  backgroundColor: colors.Others.white,
  paddingHorizontal: scale(14),
  paddingVertical: scale(14),
  color: colors.Greyscale[900],
  fontSize: scale(14),
} as const;

const PrimaryInput = (props: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    placeholderTextColor={colors.Greyscale[400]}
    {...props}
    style={[inputStyle, props.style]}
  />
);

// Auto-inserts slashes while the user types a DD/MM/YYYY date.
const formatDobInput = (text: string): string => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// Typeable DD/MM/YYYY field with a calendar button that opens the wheel picker.
const DateField = ({
  value,
  onChangeText,
  onPressPicker,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onPressPicker: () => void;
}) => (
  <View
    style={[
      inputStyle,
      { flexDirection: 'row', alignItems: 'center', paddingVertical: scale(2) },
    ]}
  >
    <TextInput
      value={value}
      onChangeText={t => onChangeText(formatDobInput(t))}
      placeholder="DD/MM/YYYY"
      placeholderTextColor={colors.Greyscale[400]}
      keyboardType="number-pad"
      maxLength={10}
      style={{
        flex: 1,
        color: colors.Greyscale[900],
        fontSize: scale(14),
        paddingVertical: scale(12),
      }}
    />
    <TouchableOpacity
      onPress={onPressPicker}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Calendar
        width={scale(20)}
        height={scale(20)}
        color={colors.Greyscale[500]}
      />
    </TouchableOpacity>
  </View>
);

const PasswordInput = ({
  value,
  onChangeText,
  show,
  onToggleShow,
  placeholder,
}: {
  value: string;
  onChangeText: (t: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
}) => (
  <View
    style={[
      inputStyle,
      {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(2),
      },
    ]}
  >
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.Greyscale[400]}
      secureTextEntry={!show}
      autoCapitalize="none"
      autoCorrect={false}
      style={{
        flex: 1,
        color: colors.Greyscale[900],
        fontSize: scale(14),
        paddingVertical: scale(12),
      }}
    />
    <TouchableOpacity
      onPress={onToggleShow}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {show ? <PasswordVisibleEye /> : <PasswordHiddenEye />}
    </TouchableOpacity>
  </View>
);
