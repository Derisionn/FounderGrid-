import { Text, View } from "react-native";
import { TimelineEvent } from "../../helpers/types";
import { scale } from "../../helpers/scaler";
import { colors } from "../../styles/colors";

const TAG_COLORS: Record<string, string> = {
  Origin: colors.Accent.grey,
  'Early Passion': colors.Accent.purple,
  'Early Genius': colors.Accent.purple,
  Foundation: colors.Accent.blue,
  Failure: colors.Accent.red,
  Breakthrough: colors.Accent.emerald,
  'Bold Decision': colors.Accent.amber,
  Decision: colors.Accent.amber,
  Milestone: colors.Accent.blueBright,
  'Smart Bet': colors.Accent.violet,
  Expansion: colors.Accent.emerald,
  Challenge: colors.Accent.red,
  'Darkest Hour': colors.Accent.red,
  Vision: colors.Accent.purple,
  'Turning Point': colors.Accent.red,
  'Big Beginning': colors.Accent.emerald,
  Comeback: colors.Accent.amber,
  'First Win': colors.Accent.emerald,
  Moonshot: colors.Accent.pink,
  'Big Bet': colors.Accent.amber,
  Innovation: colors.Accent.cyan,
  'History Made': colors.Accent.purple,
  'Bold Move': colors.Accent.amber,
};


const getTagColor = (tag: string | undefined, fallback: string): string =>
  tag && TAG_COLORS[tag] ? TAG_COLORS[tag] : fallback;
const TimelineItem = ({
  event,
  accentColor,
  isLast,
}: {
  event: TimelineEvent;
  accentColor: string;
  isLast: boolean;
}) => {
  const displayTag = event.tag ?? event.tags?.[0];
  const tagColor = getTagColor(displayTag, accentColor);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {/* Age column */}
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
            color: colors.Dark.textFainter,
            fontWeight: '700',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          AGE
        </Text>
        <Text
          style={{
            fontSize: scale(22),
            fontWeight: '900',
            color: tagColor,
            letterSpacing: -1,
            marginTop: scale(1),
          }}
        >
          {event.age ?? ''}
        </Text>
      </View>

      {/* Timeline spine + icon circle */}
      <View style={{ width: scale(52), alignItems: 'center' }}>
        <View
          style={{
            width: 2,
            height: scale(20),
            backgroundColor: colors.Dark.surfaceActive,
          }}
        />
        <View
          style={{
            width: scale(42),
            height: scale(42),
            borderRadius: scale(21),
            backgroundColor: `${tagColor}18`,
            borderWidth: 2,
            borderColor: tagColor,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: tagColor,
            shadowOpacity: 0.4,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          }}
        >
          <View
            style={{
              width: scale(12),
              height: scale(12),
              borderRadius: scale(6),
              backgroundColor: tagColor,
            }}
          />
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

      {/* Event card */}
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
            backgroundColor: colors.Dark.surface,
            borderRadius: scale(18),
            borderWidth: 1,
            borderColor: colors.Dark.borderStrong,
            overflow: 'hidden',
          }}
        >
          {/* Year + title row with thumbnail */}
          <View
            style={{
              flexDirection: 'row',
              padding: scale(12),
              paddingBottom: scale(6),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: scale(12),
                  fontWeight: '700',
                  color: tagColor,
                  marginBottom: scale(5),
                  letterSpacing: 0.3,
                }}
              >
                {event.year}
              </Text>
              <Text
                style={{
                  fontSize: scale(14),
                  fontWeight: '800',
                  color: colors.Others.white,
                  letterSpacing: -0.3,
                  lineHeight: scale(20),
                }}
              >
                {event.title}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={{
              fontSize: scale(12.5),
              color: colors.Dark.textFaint,
              lineHeight: scale(19),
              paddingHorizontal: scale(12),
              paddingBottom: scale(10),
            }}
            numberOfLines={3}
          >
            {event.story ?? event.description}
          </Text>

          {/* Tag badge */}
          {displayTag && (
            <View
              style={{ paddingHorizontal: scale(12), paddingBottom: scale(14) }}
            >
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: `${tagColor}20`,
                  borderRadius: scale(20),
                  paddingVertical: scale(5),
                  paddingHorizontal: scale(14),
                  borderWidth: 1,
                  borderColor: `${tagColor}40`,
                }}
              >
                <Text
                  style={{
                    fontSize: scale(11),
                    color: tagColor,
                    fontWeight: '700',
                  }}
                >
                  {displayTag}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TimelineItem;