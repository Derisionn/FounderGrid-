import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { scale } from '../../helpers/scaler';
import { Founder, TimelineCategory, TimelineEvent } from '../../helpers/types';
import { colors } from '../../styles/colors';

export const categoryConfig: Record<
  TimelineCategory,
  { label: string; color: string; bgColor: string; emoji: string }
> = {
  milestone: { label: 'Milestone', color: colors.Accent.blue, bgColor: colors.Accent.blueGlow, emoji: '🏆' },
  funding:   { label: 'Funding',   color: colors.Accent.green, bgColor: colors.Accent.greenGlowStrong, emoji: '💰' },
  product:   { label: 'Product',   color: colors.Accent.violet, bgColor: colors.Accent.violetGlow, emoji: '🚀' },
  acquisition: { label: 'Acquisition', color: colors.Accent.amber, bgColor: colors.Accent.amberGlow, emoji: '🤝' },
  personal:  { label: 'Personal',  color: colors.Accent.pink, bgColor: colors.Accent.pinkGlow, emoji: '👤' },
  setback:   { label: 'Setback',   color: colors.Accent.red, bgColor: colors.Accent.redGlow, emoji: '⚡' },
};

export const FounderAvatar = ({
  initials,
  accentColor,
  size = 56,
}: {
  initials: string;
  accentColor: string;
  size?: number;
}) => (
  <View
    style={{
      width: scale(size),
      height: scale(size),
      borderRadius: scale(size / 2),
      backgroundColor: accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2.5,
      borderColor: `${accentColor}60`,
      shadowColor: accentColor,
      shadowOpacity: 0.55,
      shadowRadius: scale(10),
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    }}
  >
    <Text
      style={{
        fontSize: scale(size * 0.32),
        fontWeight: '800',
        color: colors.Others.white,
        letterSpacing: 1,
      }}
    >
      {initials}
    </Text>
  </View>
);

export const FounderChip = ({
  founder,
  selected,
  onPress,
}: {
  founder: Founder;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(7),
      paddingHorizontal: scale(12),
      borderRadius: scale(30),
      marginRight: scale(8),
      backgroundColor: selected
        ? `${founder.profile.accentColor}22`
        : colors.Dark.surfaceMuted,
      borderWidth: 1.5,
      borderColor: selected
        ? founder.profile.accentColor
        : colors.Dark.surfaceStrong,
    }}
  >
    <View
      style={{
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        backgroundColor: founder.profile.accentColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(6),
      }}
    >
      <Text style={{ fontSize: scale(9), fontWeight: '800', color: colors.Others.white }}>
        {founder.profile.avatarInitials}
      </Text>
    </View>
    <Text
      style={{
        fontSize: scale(12),
        fontWeight: '600',
        color: selected ? colors.Others.white : colors.Dark.textDim,
      }}
    >
      {founder.profile.name.split(' ')[0]}{' '}
      {founder.profile.name.split(' ').slice(-1)[0]}
    </Text>
  </TouchableOpacity>
);

export const CategoryPill = ({
  category,
  selected,
  accentColor,
  onPress,
}: {
  category: TimelineCategory | 'all';
  selected: boolean;
  accentColor: string;
  onPress: () => void;
}) => {
  const cfg = category === 'all' ? null : categoryConfig[category];
  const label = category === 'all' ? 'All' : cfg!.label;
  const emoji = category === 'all' ? '✨' : cfg!.emoji;
  const activeColor = category === 'all' ? accentColor : cfg!.color;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(7),
        paddingHorizontal: scale(14),
        borderRadius: scale(30),
        marginRight: scale(8),
        backgroundColor: selected ? activeColor : colors.Dark.surfaceHover,
        borderWidth: 1,
        borderColor: selected ? activeColor : colors.Dark.surfaceStronger,
        shadowColor: selected ? activeColor : colors.Others.transparent,
        shadowOpacity: selected ? 0.45 : 0,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: selected ? 4 : 0,
      }}
    >
      <Text style={{ fontSize: scale(12), marginRight: scale(4) }}>{emoji}</Text>
      <Text
        style={{
          fontSize: scale(12),
          fontWeight: '600',
          color: selected ? colors.Others.white : colors.Dark.textSofter,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const StatBadge = ({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string;
  accentColor?: string;
}) => (
  <View
    style={{
      backgroundColor: accentColor ? `${accentColor}14` : colors.Dark.surfaceActive,
      borderRadius: scale(10),
      paddingVertical: scale(8),
      paddingHorizontal: scale(12),
      alignItems: 'center',
      marginRight: scale(8),
      marginTop: scale(6),
      borderWidth: 1,
      borderColor: accentColor ? `${accentColor}30` : colors.Dark.surfaceStrong,
    }}
  >
    <Text
      style={{
        fontSize: scale(15),
        fontWeight: '800',
        color: accentColor ?? colors.Others.white,
        letterSpacing: -0.5,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: scale(10),
        color: colors.Dark.textFainter,
        marginTop: scale(2),
        fontWeight: '500',
      }}
    >
      {label}
    </Text>
  </View>
);

export const TagChip = ({ tag, accentColor }: { tag: string; accentColor: string }) => (
  <View
    style={{
      backgroundColor: `${accentColor}18`,
      borderRadius: scale(20),
      paddingVertical: scale(4),
      paddingHorizontal: scale(10),
      marginRight: scale(6),
      marginTop: scale(5),
      borderWidth: 1,
      borderColor: `${accentColor}35`,
    }}
  >
    <Text
      style={{
        fontSize: scale(10),
        color: accentColor,
        fontWeight: '600',
      }}
    >
      #{tag}
    </Text>
  </View>
);

export const EventCard = ({
  event,
  isLastInYear,
  isFirst,
  
}: {
  event: TimelineEvent;
  isLastInYear: boolean;
  isFirst: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = categoryConfig[event.category];

  return (
    <View style={{ flexDirection: 'row', marginBottom: isLastInYear ? scale(4) : 0 }}>
      {/* Timeline spine */}
      <View style={{ width: scale(36), alignItems: 'center' }}>
        {/* Top connector */}
        <View
          style={{
            width: 2,
            height: isFirst ? scale(16) : scale(8),
            backgroundColor: colors.Dark.surfaceStrong,
          }}
        />

        {/* Dot */}
        {event.isHighlight ? (
          /* Glow ring for highlight events */
          <View
            style={{
              width: scale(22),
              height: scale(22),
              borderRadius: scale(11),
              backgroundColor: `${cfg.color}20`,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: `${cfg.color}50`,
              shadowColor: cfg.color,
              shadowOpacity: 0.7,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          >
            <View
              style={{
                width: scale(10),
                height: scale(10),
                borderRadius: scale(5),
                backgroundColor: cfg.color,
              }}
            />
          </View>
        ) : (
          <View
            style={{
              width: scale(12),
              height: scale(12),
              borderRadius: scale(6),
              backgroundColor: `${cfg.color}80`,
              borderWidth: 1.5,
              borderColor: cfg.color,
            }}
          />
        )}

        {/* Bottom connector */}
        {!isLastInYear && (
          <View
            style={{
              flex: 1,
              width: 2,
              backgroundColor: colors.Dark.surfaceStrong,
              minHeight: scale(20),
            }}
          />
        )}
      </View>

      {/* Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded(e => !e)}
        style={{
          flex: 1,
          marginLeft: scale(10),
          marginBottom: scale(14),
          backgroundColor: event.isHighlight
            ? colors.Dark.surfaceHover
            : colors.Dark.surfaceSubtle,
          borderRadius: scale(16),
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: event.isHighlight
            ? `${cfg.color}40`
            : colors.Dark.border,
        }}
      >
        {/* Top accent bar — thicker and fully opaque for highlights */}
        <View
          style={{
            height: event.isHighlight ? scale(3) : scale(1.5),
            backgroundColor: cfg.color,
            opacity: event.isHighlight ? 1 : 0.4,
          }}
        />

        {/* Left accent strip for highlights */}
        {event.isHighlight && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: scale(3.5),
              backgroundColor: cfg.color,
              opacity: 0.7,
            }}
          />
        )}

        <View
          style={{
            padding: scale(13),
            paddingLeft: event.isHighlight ? scale(16) : scale(13),
          }}
        >
          {/* Category + month */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: scale(8),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: cfg.bgColor,
                paddingVertical: scale(3),
                paddingHorizontal: scale(9),
                borderRadius: scale(20),
              }}
            >
              <Text style={{ fontSize: scale(10), marginRight: scale(4) }}>
                {cfg.emoji}
              </Text>
              <Text
                style={{
                  fontSize: scale(10),
                  fontWeight: '700',
                  color: cfg.color,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {cfg.label}
              </Text>
            </View>
            {event.month ? (
              <Text
                style={{
                  fontSize: scale(11),
                  color: colors.Dark.textTrace,
                  fontWeight: '500',
                }}
              >
                {event.month}
              </Text>
            ) : null}
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: scale(event.isHighlight ? 15 : 13),
              fontWeight: '700',
              color: event.isHighlight ? colors.Others.white : colors.Dark.textBody,
              marginBottom: scale(5),
              lineHeight: scale(event.isHighlight ? 22 : 20),
              letterSpacing: -0.2,
            }}
          >
            {event.title}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: scale(13),
              color: colors.Dark.textDim,
              lineHeight: scale(19),
            }}
            numberOfLines={expanded ? undefined : 3}
          >
            {event.description}
          </Text>

          {/* Stats */}
          {event.stats && event.stats.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: scale(10) }}>
              {event.stats.map((s, i) => (
                <StatBadge
                  key={i}
                  label={s.label}
                  value={s.value}
                  accentColor={event.isHighlight ? cfg.color : undefined}
                />
              ))}
            </View>
          )}

          {/* Quote (expanded) */}
          {expanded && event.quote ? (
            <View
              style={{
                marginTop: scale(12),
                backgroundColor: `${cfg.color}10`,
                borderRadius: scale(10),
                padding: scale(12),
                borderLeftWidth: 3,
                borderLeftColor: cfg.color,
              }}
            >
              <Text
                style={{
                  fontSize: scale(18),
                  color: cfg.color,
                  opacity: 0.6,
                  lineHeight: scale(14),
                  marginBottom: scale(4),
                  fontWeight: '900',
                }}
              >
                "
              </Text>
              <Text
                style={{
                  fontSize: scale(12),
                  fontStyle: 'italic',
                  color: colors.Dark.textSofter,
                  lineHeight: scale(18),
                }}
              >
                {event.quote}
              </Text>
            </View>
          ) : null}

          {/* Tags (expanded) */}
          {expanded && event.tags && event.tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: scale(10) }}>
              {event.tags.map((tag, i) => (
                <TagChip key={i} tag={tag} accentColor={cfg.color} />
              ))}
            </View>
          )}

          {/* Expand toggle */}
          <TouchableOpacity
            onPress={() => setExpanded(e => !e)}
            style={{
              marginTop: scale(10),
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${cfg.color}15`,
              paddingVertical: scale(4),
              paddingHorizontal: scale(10),
              borderRadius: scale(20),
            }}
          >
            <Text style={{ fontSize: scale(11), color: cfg.color, fontWeight: '600' }}>
              {expanded ? 'Show less  ↑' : 'Read more  ↓'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const YearHeader = ({
  year,
  count,
  accentColor,
}: {
  year: number;
  count: number;
  accentColor: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(14),
      marginTop: scale(10),
    }}
  >
    <View
      style={{
        backgroundColor: accentColor,
        borderRadius: scale(10),
        paddingVertical: scale(6),
        paddingHorizontal: scale(16),
        marginRight: scale(12),
        shadowColor: accentColor,
        shadowOpacity: 0.55,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
      }}
    >
      <Text
        style={{
          fontSize: scale(14),
          fontWeight: '800',
          color: colors.Others.white,
          letterSpacing: 0.5,
        }}
      >
        {year}
      </Text>
    </View>
    <View style={{ flex: 1, height: 1, backgroundColor: colors.Dark.surfaceRaised }} />
    <View
      style={{
        marginLeft: scale(8),
        backgroundColor: colors.Dark.surfaceHover,
        borderRadius: scale(20),
        paddingVertical: scale(3),
        paddingHorizontal: scale(9),
      }}
    >
      <Text
        style={{
          fontSize: scale(10),
          color: colors.Dark.textWhisper,
          fontWeight: '600',
        }}
      >
        {count} event{count > 1 ? 's' : ''}
      </Text>
    </View>
  </View>
);

export const FounderHeroCard = ({ founder }: { founder: Founder }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const { profile } = founder;
  const ac = profile.accentColor;

  return (
    <View
      style={{
        borderRadius: scale(20),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `${ac}35`,
        marginBottom: scale(24),
        backgroundColor: colors.Dark.surfaceSubtle,
      }}
    >
      {/* Banner */}
      <View style={{ height: scale(64), backgroundColor: ac, opacity: 0.18 }} />

      {/* Avatar row — overlaps the banner */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginTop: -scale(32),
          paddingHorizontal: scale(18),
          marginBottom: scale(14),
        }}
      >
        {/* Avatar with dark border ring to "cut" from banner */}
        <View
          style={{
            borderWidth: 3,
            borderColor: colors.Dark.bg,
            borderRadius: scale(34),
          }}
        >
          <FounderAvatar initials={profile.avatarInitials} accentColor={ac} size={58} />
        </View>
        <View style={{ flex: 1, marginLeft: scale(12), paddingBottom: scale(4) }}>
          <Text
            style={{
              fontSize: scale(19),
              fontWeight: '800',
              color: colors.Others.white,
              letterSpacing: -0.4,
            }}
          >
            {profile.name}
          </Text>
          <Text
            style={{
              fontSize: scale(12),
              color: ac,
              fontWeight: '600',
              marginTop: scale(2),
              opacity: 0.9,
            }}
          >
            {profile.title} · {profile.company}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: scale(18), paddingBottom: scale(18) }}>
        {/* Key stats */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: `${ac}0D`,
            borderRadius: scale(14),
            padding: scale(14),
            marginBottom: scale(16),
            borderWidth: 1,
            borderColor: `${ac}20`,
          }}
        >
          {[
            { label: 'Net Worth', value: profile.netWorth },
            { label: 'Raised', value: profile.totalFundsRaised },
            { label: 'Users', value: profile.usersServed },
          ].map((stat, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: scale(14),
                  fontWeight: '800',
                  color: colors.Others.white,
                  letterSpacing: -0.4,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: scale(10),
                  color: colors.Dark.textGhost,
                  marginTop: scale(3),
                  fontWeight: '500',
                }}
              >
                {stat.label}
              </Text>
              {i < 2 && (
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '10%',
                    height: '80%',
                    width: 1,
                    backgroundColor: `${ac}30`,
                  }}
                />
              )}
            </View>
          ))}
        </View>

        {/* Bio */}
        <Text
          style={{
            fontSize: scale(13),
            color: colors.Dark.textSofter,
            lineHeight: scale(20),
            marginBottom: scale(6),
          }}
          numberOfLines={showFullBio ? undefined : 3}
        >
          {profile.bio}
        </Text>
        <TouchableOpacity
          onPress={() => setShowFullBio(b => !b)}
          style={{ marginBottom: scale(14) }}
        >
          <Text style={{ fontSize: scale(12), color: ac, fontWeight: '700' }}>
            {showFullBio ? 'Show less ↑' : 'Read full story ↓'}
          </Text>
        </TouchableOpacity>

        {/* Inspiration quote */}
        <View
          style={{
            backgroundColor: `${ac}10`,
            borderRadius: scale(12),
            padding: scale(14),
            borderLeftWidth: 3.5,
            borderLeftColor: ac,
          }}
        >
          <Text
            style={{
              fontSize: scale(20),
              color: ac,
              opacity: 0.5,
              lineHeight: scale(14),
              marginBottom: scale(6),
              fontWeight: '900',
            }}
          >
            "
          </Text>
          <Text
            style={{
              fontSize: scale(12),
              fontStyle: 'italic',
              color: colors.Dark.textSofter,
              lineHeight: scale(18),
            }}
          >
            {profile.inspiration}
          </Text>
        </View>
      </View>
    </View>
  );
};
