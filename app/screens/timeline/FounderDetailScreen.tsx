import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from '../../helpers/scaler';
import { Founder } from '../../helpers/types';
import SaveIcon from '../../../assets/icons/SaveIcon';
import SendIcon from '../../../assets/icons/SendIcon';
import LeftBackIcon from '../../../assets/icons/LeftBackIcon';
import EmptyState from '../../components/timeline/EmptyPlaceholder';
import TargetIcon from '../../../assets/icons/TargetIcon';
import TimelineItem from '../../components/timeline/TimelineItem';
import YouAreHereMarker from '../../components/timeline/YouAreHereMarker';
import { colors } from '../../styles/colors';
import { PROFILE } from '../../../assets/staticData/staticData';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Tab = 'Timeline' | 'Lessons' | 'Insights' | 'Quotes';

const TABS: Tab[] = ['Timeline', 'Lessons', 'Insights', 'Quotes'];

// Per-tab glyph + count resolver, so the tab bar reads at a glance instead of
// being four identical text labels.
const TAB_ICONS: Record<
  Tab,
  { icon: string; count: (timeline: number, lessons: number, quotes: number) => number }
> = {
  Timeline: { icon: '🗓', count: t => t },
  Lessons: { icon: '💡', count: (_t, l) => l },
  Insights: { icon: '🎯', count: () => 0 },
  Quotes: { icon: '❝', count: (_t, _l, q) => q },
};

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

const FounderDetailScreen = ({
  founder,
  onBack,
}: {
  founder: Founder;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Timeline');
  const [sortDesc, setSortDesc] = useState(false); // false = age low→high, true = high→low
  const { profile, timeline } = founder;
  const ac = profile.accentColor;

  const companies = profile.companies ?? [profile.company];
  const quotes = profile.quotes ?? [];
  const followersInspired = profile.followersInspired ?? profile.usersServed;
  const inspirationText =
    profile.inspiration?.replace(/^[""\s]+|[""\s]+$/g, '') ?? '';

  const sortedTimeline = useMemo(
    () => [...timeline].sort((a, b) => a.year - b.year),
    [timeline],
  );

  const lessonsTimeline = useMemo(
    () => sortedTimeline.filter(e => e.insight),
    [sortedTimeline],
  );

  // "Where I am now" overlay — place the user's own age against the founder's arc.
  const currentYear = new Date().getFullYear();
  const userAge = currentYear - PROFILE.birthYear;
  const yearsBuilding = Math.max(0, currentYear - PROFILE.buildingSince);

  const marker = useMemo(() => {
    const nextEvent = sortedTimeline.find(
      e => e.age != null && e.age > userAge,
    );
    // Insert before the first milestone the founder hit *after* the user's age;
    // if they were already older than the user at every event, pin it at the end.
    const index = nextEvent
      ? sortedTimeline.indexOf(nextEvent)
      : sortedTimeline.length;
    const prevEvent = [...sortedTimeline.slice(0, index)]
      .reverse()
      .find(e => e.age != null);
    return { index, prevEvent, nextEvent };
  }, [sortedTimeline, userAge]);

  // Display order follows the sort toggle; the "you are here" marker index is
  // computed against the chronological (asc) array, so remap it when reversed.
  const displayTimeline = useMemo(
    () => (sortDesc ? [...sortedTimeline].reverse() : sortedTimeline),
    [sortedTimeline, sortDesc],
  );
  const markerIndex = sortDesc
    ? sortedTimeline.length - marker.index
    : marker.index;

  return (
    <View style={{ flex: 1, backgroundColor: colors.Greyscale[900]}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
      >
        <View
          style={{
            height: scale(300),
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background image */}
          {profile.image ? (
            <Image
              source={{ uri: profile.image }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: SCREEN_WIDTH,
                height: scale(300),
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: `${ac}25`,
              }}
            />
          )}

          {/* Overlay: full dark tint */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.Dark.scrimSoft,
            }}
          />

          {/* Overlay: bottom fade into screen bg */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: scale(180),
              backgroundColor: colors.Dark.bgOverlay,
            }}
          />

          {/* Top action bar */}
          <SafeAreaView
            edges={['top']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: scale(16),
                paddingTop: scale(8),
              }}
            >
              <TouchableOpacity
                onPress={onBack}
                style={{
                  width: scale(36),
                  height: scale(36),
                  borderRadius: scale(10),
                  backgroundColor: colors.Dark.scrimStrong,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  borderWidth: 1,
                  borderColor: colors.Dark.surfaceContrast,
                }}
                activeOpacity={0.8}
              >
                <LeftBackIcon />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: scale(8) }}>
                <TouchableOpacity
                  style={{
                    width: scale(36),
                    height: scale(36),
                    borderRadius: scale(10),
                    backgroundColor: colors.Dark.scrimStrong,
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    borderWidth: 1,
                    borderColor: colors.Dark.surfaceContrast,
                  }}
                  activeOpacity={0.8}
                >
                  <SaveIcon width={scale(18)} height={scale(18)} color={colors.Greyscale[0]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: scale(36),
                    height: scale(36),
                    borderRadius: scale(10),
                    backgroundColor: colors.Dark.scrimStrong,
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    borderWidth: 1,
                    borderColor: colors.Dark.surfaceContrast,
                  }}
                  activeOpacity={0.8}
                >
                  <SendIcon width={scale(16)} height={scale(16)} color={colors.Greyscale[0]} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Hero info (bottom of hero) */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: scale(20),
              paddingBottom: scale(20),
            }}
          >
            <Text
              style={{
                fontSize: scale(34),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -1.2,
                marginBottom: scale(3),
              }}
            >
              {profile.name}
            </Text>
            <Text
              style={{
                fontSize: scale(14),
                color: colors.Dark.textDim,
                fontWeight: '500',
                marginBottom: scale(8),
              }}
            >
              {companies.join(' • ')}
            </Text>
            {inspirationText ? (
              <Text
                style={{
                  fontSize: scale(12.5),
                  color: colors.Dark.textGhost,
                  fontStyle: 'italic',
                  lineHeight: scale(19),
                  marginBottom: scale(14),
                }}
                numberOfLines={2}
              >
                "{inspirationText}"
              </Text>
            ) : null}

            {/* Avatar stack + inspired count */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[colors.Accent.blue, colors.Accent.violet, colors.Accent.emerald].map((color, i) => (
                <View
                  key={i}
                  style={{
                    width: scale(22),
                    height: scale(22),
                    borderRadius: scale(11),
                    backgroundColor: color,
                    marginLeft: i === 0 ? 0 : -scale(7),
                    borderWidth: 1.5,
                    borderColor: colors.Dark.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: scale(7),
                      color: colors.Others.white,
                      fontWeight: '800',
                    }}
                  >
                    {['A', 'B', 'C'][i]}
                  </Text>
                </View>
              ))}
              <Text
                style={{
                  marginLeft: scale(8),
                  fontSize: scale(12),
                  color: colors.Dark.textFaint,
                  fontWeight: '500',
                }}
              >
                {followersInspired} people inspired
              </Text>
            </View>
          </View>
        </View>

        {/* ── Sticky Tab Bar ───────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: colors.Dark.bg,
            borderBottomWidth: 1,
            borderBottomColor: colors.Dark.borderSubtle,
            paddingVertical: scale(12),
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: scale(16),
              alignItems: 'center',
            }}
          >
            {TABS.map((tab, i) => {
              const isActive = activeTab === tab;
              const count = TAB_ICONS[tab].count(
                sortedTimeline.length,
                lessonsTimeline.length,
                quotes.length,
              );
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scale(6),
                    paddingVertical: scale(9),
                    paddingHorizontal: scale(15),
                    marginRight: i === TABS.length - 1 ? 0 : scale(9),
                    borderRadius: scale(20),
                    backgroundColor: isActive ? `${ac}22` : colors.Dark.surface,
                    borderWidth: 1,
                    borderColor: isActive ? `${ac}66` : colors.Dark.border,
                  }}
                >
                  <Text style={{ fontSize: scale(13) }}>
                    {TAB_ICONS[tab].icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: scale(13.5),
                      fontWeight: isActive ? '800' : '600',
                      color: isActive ? colors.Others.white : colors.Dark.textGhost,
                      letterSpacing: 0.2,
                    }}
                  >
                    {tab}
                  </Text>
                  {count > 0 && (
                    <View
                      style={{
                        minWidth: scale(18),
                        height: scale(18),
                        paddingHorizontal: scale(5),
                        borderRadius: scale(9),
                        backgroundColor: isActive ? ac : colors.Dark.surfaceStrong,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: scale(9.5),
                          fontWeight: '800',
                          color: isActive
                            ? colors.Others.white
                            : colors.Dark.textFaint,
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Tab Content ──────────────────────────────────────────── */}
        <View
          style={{
            paddingTop: scale(20),
            paddingHorizontal: scale(16),
            paddingBottom: scale(80),
          }}
        >
          {/* Timeline tab */}
          {activeTab === 'Timeline' && (
            <View>
              {/* Sort filter */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: scale(16),
                }}
              >
                <Text
                  style={{
                    fontSize: scale(11),
                    fontWeight: '700',
                    color: colors.Dark.textFainter,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}
                >
                  {sortedTimeline.length} moments
                </Text>
                <TouchableOpacity
                  onPress={() => setSortDesc(d => !d)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scale(6),
                    paddingVertical: scale(7),
                    paddingHorizontal: scale(12),
                    borderRadius: scale(20),
                    backgroundColor: `${ac}18`,
                    borderWidth: 1,
                    borderColor: `${ac}44`,
                  }}
                >
                  <Text
                    style={{
                      fontSize: scale(12),
                      fontWeight: '700',
                      color: colors.Others.white,
                      letterSpacing: 0.2,
                    }}
                  >
                    {sortDesc ? 'Age: High → Low' : 'Age: Low → High'}
                  </Text>
                  <Text style={{ fontSize: scale(13), fontWeight: '900', color: ac }}>
                    {sortDesc ? '↓' : '↑'}
                  </Text>
                </TouchableOpacity>
              </View>

              {displayTimeline.map((event, idx) => (
                <React.Fragment key={event.id}>
                  {idx === markerIndex && (
                    <YouAreHereMarker
                      userAge={userAge}
                      yearsBuilding={yearsBuilding}
                      founderName={profile.name}
                      prevEvent={marker.prevEvent}
                      nextEvent={marker.nextEvent}
                      isLast={false}
                    />
                  )}
                  <TimelineItem
                    event={event}
                    accentColor={ac}
                    isLast={
                      idx === displayTimeline.length - 1 &&
                      markerIndex !== displayTimeline.length
                    }
                  />
                </React.Fragment>
              ))}
              {markerIndex === displayTimeline.length && (
                <YouAreHereMarker
                  userAge={userAge}
                  yearsBuilding={yearsBuilding}
                  founderName={profile.name}
                  prevEvent={marker.prevEvent}
                  nextEvent={marker.nextEvent}
                  isLast
                />
              )}
            </View>
          )}

          {/* Lessons tab */}
          {activeTab === 'Lessons' && (
            <View>
              {lessonsTimeline.length > 0 ? (
                lessonsTimeline.map(event => {
                  const tagColor = getTagColor(
                    event.tag ?? event.tags?.[0],
                    ac,
                  );
                  return (
                    <View
                      key={event.id}
                      style={{
                        backgroundColor: colors.Dark.surface,
                        borderRadius: scale(16),
                        padding: scale(16),
                        marginBottom: scale(12),
                        borderWidth: 1,
                        borderColor: `${tagColor}22`,
                        borderLeftWidth: 3,
                        borderLeftColor: tagColor,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: scale(8),
                          gap: scale(8),
                        }}
                      >
                        <Text style={{ fontSize: scale(18) }}>
                          {event.icon}
                        </Text>
                        <Text
                          style={{
                            fontSize: scale(10),
                            color: tagColor,
                            fontWeight: '700',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {event.year}
                          {event.age != null ? `  ·  Age ${event.age}` : ''}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: scale(14),
                          fontWeight: '700',
                          color: colors.Others.white,
                          marginBottom: scale(8),
                          lineHeight: scale(20),
                        }}
                      >
                        {event.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: scale(13),
                          color: colors.Dark.textSofter,
                          lineHeight: scale(20),
                          fontStyle: 'italic',
                        }}
                      >
                        "{event.insight}"
                      </Text>
                    </View>
                  );
                })
              ) : (
                <EmptyState
                  icon="💡"
                  title="No lessons yet"
                  subtitle="Lessons from this founder's journey will appear here"
                />
              )}
            </View>
          )}

          {/* Insights tab */}
          {activeTab === 'Insights' && (
            <EmptyState
              icon={
                <TargetIcon
                  width={scale(40)}
                  height={scale(40)}
                  colors={colors.Dark.textFainter}
                />
              }
              title="Insights coming soon"
              subtitle="Deep analysis of this founder's patterns and key decisions"
            />
          )}

          {/* Quotes tab */}
          {activeTab === 'Quotes' && (
            <View>
              {quotes.length > 0 ? (
                quotes.map((q, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: colors.Dark.surface,
                      borderRadius: scale(18),
                      padding: scale(20),
                      marginBottom: scale(12),
                      borderWidth: 1,
                      borderColor: `${ac}20`,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: scale(30),
                        color: ac,
                        fontWeight: '900',
                        opacity: 0.45,
                        lineHeight: scale(22),
                        marginBottom: scale(10),
                      }}
                    >
                      ❝
                    </Text>
                    <Text
                      style={{
                        fontSize: scale(15),
                        color: colors.Dark.textSecondary,
                        lineHeight: scale(23),
                        fontStyle: 'italic',
                        letterSpacing: 0.1,
                      }}
                    >
                      {q}
                    </Text>
                    <Text
                      style={{
                        fontSize: scale(12),
                        color: ac,
                        fontWeight: '600',
                        marginTop: scale(12),
                      }}
                    >
                      — {profile.name}
                    </Text>
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="💬"
                  title="No quotes yet"
                  subtitle="Quotes from this founder will appear here"
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FounderDetailScreen;
