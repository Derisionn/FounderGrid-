import { scale } from "../../helpers/scaler";
import { Founder } from "../../helpers/types";
import { FounderAvatar } from "./TimelineComponents";
import { colors } from "../../styles/colors";
import {
  View,
  Text,
  TouchableOpacity,

} from 'react-native';


const FounderSuggestionCard = ({
  founder,
  onPress,
}: {
  founder: Founder;
  onPress: () => void;
}) => {
  const ac = founder.profile.accentColor;
  const eventCount = founder.timeline?.length ?? 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.Dark.surface,
        borderRadius: scale(18),
        padding: scale(14),
        marginBottom: scale(10),
        borderWidth: 1,
        borderColor: `${ac}28`,
        borderLeftWidth: 3.5,
        borderLeftColor: ac,
        shadowColor: ac,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <FounderAvatar initials={founder.profile.avatarInitials} accentColor={ac} size={46} />
      <View style={{ flex: 1, marginLeft: scale(12) }}>
        <Text style={{ fontSize: scale(15), fontWeight: '700', color: colors.Others.white, letterSpacing: -0.2 }}>
          {founder.profile.name}
        </Text>
        <Text style={{ fontSize: scale(12), color: `${ac}CC`, marginTop: scale(2), fontWeight: '500' }}>
          {founder.profile.title} · {founder.profile.company}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(6), gap: scale(6) }}>
          <View style={{ backgroundColor: `${ac}18`, borderRadius: scale(20), paddingVertical: scale(2), paddingHorizontal: scale(8), borderWidth: 1, borderColor: `${ac}30` }}>
            <Text style={{ fontSize: scale(10), color: ac, fontWeight: '600' }}>
              {founder.profile.netWorth}
            </Text>
          </View>
          <View style={{ backgroundColor: colors.Dark.surfaceHover, borderRadius: scale(20), paddingVertical: scale(2), paddingHorizontal: scale(8) }}>
            <Text style={{ fontSize: scale(10), color: colors.Dark.textFainter, fontWeight: '600' }}>
              {eventCount} events
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: `${ac}20`,
          borderRadius: scale(24),
          paddingVertical: scale(8),
          paddingHorizontal: scale(12),
          borderWidth: 1,
          borderColor: `${ac}45`,
        }}
      >
        <Text style={{ fontSize: scale(12), color: ac, fontWeight: '700' }}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FounderSuggestionCard;