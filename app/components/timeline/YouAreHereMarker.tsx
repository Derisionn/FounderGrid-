import { Text, View } from 'react-native';
import { TimelineEvent } from '../../helpers/types';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';

// The user's brand accent — deliberately distinct from the founder's accent so
// the "you are here" line reads as *your* marker cutting across their arc.
const YOU = colors.Accent.blue;

const firstName = (name: string) => name.trim().split(/\s+/)[0];

// Turns the user's age + the founder's surrounding milestones into a single
// emotionally-loaded sentence — the whole point of the overlay.
const buildMessage = (
  userAge: number,
  founderName: string,
  prev: TimelineEvent | undefined,
  next: TimelineEvent | undefined,
): string => {
  const who = firstName(founderName);
  if (next?.age != null) {
    const gap = next.age - userAge;
    if (gap <= 0) return `At your age, ${who} was right where you are now.`;
    const years = gap === 1 ? 'year' : 'years';
    return `At your age, ${who} was still ${gap} ${years} from "${next.title}".`;
  }
  if (prev != null) {
    return `By your age, ${who} had already reached "${prev.title}".`;
  }
  return `${who}'s journey hadn't even begun at your age — you're ahead of the clock.`;
};

const YouAreHereMarker = ({
  userAge,
  yearsBuilding,
  founderName,
  prevEvent,
  nextEvent,
  isLast,
}: {
  userAge: number;
  yearsBuilding: number;
  founderName: string;
  prevEvent?: TimelineEvent;
  nextEvent?: TimelineEvent;
  isLast: boolean;
}) => {
  const message = buildMessage(userAge, founderName, prevEvent, nextEvent);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {/* Age column — mirrors TimelineItem's age rail */}
      <View
        style={{
          width: scale(52),
          alignItems: 'center',
          paddingTop: scale(20),
        }}
      >
        <Text
          style={{
            fontSize: scale(8),
            color: YOU,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          You
        </Text>
        <Text
          style={{
            fontSize: scale(22),
            fontWeight: '900',
            color: YOU,
            letterSpacing: -1,
            marginTop: scale(1),
          }}
        >
          {userAge}
        </Text>
      </View>

      {/* Timeline spine + marker node */}
      <View style={{ width: scale(52), alignItems: 'center' }}>
        <View style={{ width: 2, height: scale(20), backgroundColor: YOU }} />
        <View
          style={{
            width: scale(42),
            height: scale(42),
            borderRadius: scale(21),
            backgroundColor: YOU,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: YOU,
            shadowOpacity: 0.6,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: scale(18) }}>📍</Text>
        </View>
        {!isLast && (
          <View
            style={{
              flex: 1,
              width: 2,
              backgroundColor: colors.Dark.surfaceActive,
              minHeight: scale(60),
            }}
          />
        )}
      </View>

      {/* Marker card */}
      <View
        style={{
          flex: 1,
          marginLeft: scale(6),
          marginTop: scale(8),
          marginBottom: scale(16),
        }}
      >
        <View
          style={{
            backgroundColor: colors.Accent.blueGlowSubtle,
            borderRadius: scale(18),
            borderWidth: 1.5,
            borderColor: colors.Accent.blueBorderStrong,
            borderStyle: 'dashed',
            padding: scale(14),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: scale(8),
              gap: scale(6),
            }}
          >
            <View
              style={{
                width: scale(6),
                height: scale(6),
                borderRadius: scale(3),
                backgroundColor: YOU,
              }}
            />
            <Text
              style={{
                fontSize: scale(10),
                color: YOU,
                fontWeight: '800',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              You are here
            </Text>
          </View>

          <Text
            style={{
              fontSize: scale(14),
              fontWeight: '700',
              color: colors.Others.white,
              lineHeight: scale(21),
            }}
          >
            {message}
          </Text>

          <Text
            style={{
              fontSize: scale(11.5),
              color: colors.Dark.textFaint,
              marginTop: scale(8),
              fontWeight: '500',
            }}
          >
            {yearsBuilding > 0
              ? `You're ${yearsBuilding} ${yearsBuilding === 1 ? 'year' : 'years'} into your own build.`
              : 'Your build starts today.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default YouAreHereMarker;
