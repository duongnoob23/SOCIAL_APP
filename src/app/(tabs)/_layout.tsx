import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabBarIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconActive]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Đăng bài',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="➕" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🔔" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options= {{
          title:'Học tập',
          tabBarIcon: ({focused}) => <TabBarIcon emoji="📚" focused={focused} /> 
        }}
        />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopColor: '#1E1E2E',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconActive: {
    backgroundColor: 'rgba(108,99,255,0.18)',
  },
  emoji: {
    fontSize: 20,
  },
});
