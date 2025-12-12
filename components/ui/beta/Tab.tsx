import React, { createContext, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../theme";

// ============================================================================
// Types
// ============================================================================

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  forceMount?: boolean;
}

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// ============================================================================
// Tabs Root Component
// ============================================================================

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
  style,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View style={[styles.tabsRoot, style]}>{children}</View>
    </TabsContext.Provider>
  );
};

// ============================================================================
// TabsList Component
// ============================================================================

export const TabsList: React.FC<TabsListProps> = ({
  children,
  style,
  scrollable = false,
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.tabsListContent,
      }
    : {};

  return (
    <Container style={[styles.tabsList, style]} {...containerProps}>
      {children}
    </Container>
  );
};

// ============================================================================
// TabsTrigger Component
// ============================================================================

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = selectedValue === value;

  const handlePress = useCallback(() => {
    if (!disabled) {
      onValueChange(value);
    }
  }, [value, onValueChange, disabled]);

  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        disabled && styles.tabsTriggerDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          isActive && styles.tabsTriggerTextActive,
          disabled && styles.tabsTriggerTextDisabled,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// TabsContent Component
// ============================================================================

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  style,
  forceMount = false,
}) => {
  const { value: selectedValue } = useTabsContext();
  const isActive = selectedValue === value;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <View
      style={[styles.tabsContent, !isActive && styles.tabsContentHidden, style]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  tabsRoot: {
    // width: "100%",
    flex: 1,
  },
  tabsList: {
    flexDirection: "row",
    // backgroundColor: "#f1f5f9",
    borderRadius: 8,
    // padding: 4,
  },
  tabsListContent: {
    flexDirection: "row",
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    // borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  tabsTriggerActive: {
    // backgroundColor: "#ffffff",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 1,
    borderBottomColor: theme.primary,
    borderBottomWidth: 2,
  },
  tabsTriggerDisabled: {
    opacity: 0.5,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  tabsTriggerTextActive: {
    color: theme.foreground,
    fontWeight: "600",
  },
  tabsTriggerTextDisabled: {
    color: "#cbd5e1",
  },
  tabsContent: {
    flex: 1,
    marginTop: 16,
  },
  tabsContentHidden: {
    display: "none",
  },
});

// ============================================================================
// Example Usage
// ============================================================================

// export default function TabsExample() {
//   const [activeTab, setActiveTab] = useState("account");

//   return (
//     <View style={exampleStyles.container}>
//       <Text style={exampleStyles.title}>Tabs Component Example</Text>

//       {/* Controlled Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList>
//           <TabsTrigger value="account">Account</TabsTrigger>
//           <TabsTrigger value="password">Password</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="account">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Account Information</Text>
//             <Text style={exampleStyles.contentText}>
//               Manage your account settings and preferences here. You can update
//               your profile information, email, and other account details.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="password">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Password Settings</Text>
//             <Text style={exampleStyles.contentText}>
//               Change your password and manage security settings. Make sure to
//               use a strong password with a mix of letters, numbers, and symbols.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="settings">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>General Settings</Text>
//             <Text style={exampleStyles.contentText}>
//               Configure your app preferences, notifications, and other general
//               settings to customize your experience.
//             </Text>
//           </View>
//         </TabsContent>
//       </Tabs>

//       {/* Scrollable Tabs */}
//       <View style={exampleStyles.separator} />

//       <Text style={exampleStyles.subtitle}>Scrollable Tabs</Text>
//       <Tabs defaultValue="tab1">
//         <TabsList scrollable>
//           <TabsTrigger value="tab1">Overview</TabsTrigger>
//           <TabsTrigger value="tab2">Analytics</TabsTrigger>
//           <TabsTrigger value="tab3">Reports</TabsTrigger>
//           <TabsTrigger value="tab4">Notifications</TabsTrigger>
//           <TabsTrigger value="tab5">Settings</TabsTrigger>
//           <TabsTrigger value="tab6" disabled>
//             Premium
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="tab1">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Overview</Text>
//             <Text style={exampleStyles.contentText}>
//               View your dashboard overview with key metrics and insights.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="tab2">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Analytics</Text>
//             <Text style={exampleStyles.contentText}>
//               Detailed analytics and data visualization for your app.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="tab3">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Reports</Text>
//             <Text style={exampleStyles.contentText}>
//               Generate and view comprehensive reports.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="tab4">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Notifications</Text>
//             <Text style={exampleStyles.contentText}>
//               Manage your notification preferences.
//             </Text>
//           </View>
//         </TabsContent>

//         <TabsContent value="tab5">
//           <View style={exampleStyles.contentCard}>
//             <Text style={exampleStyles.contentTitle}>Settings</Text>
//             <Text style={exampleStyles.contentText}>
//               Configure application settings.
//             </Text>
//           </View>
//         </TabsContent>
//       </Tabs>
//     </View>
//   );
// }

// const exampleStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#ffffff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#0f172a",
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     color: "#334155",
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#e2e8f0",
//     marginVertical: 24,
//   },
//   contentCard: {
//     padding: 20,
//     backgroundColor: "#f8fafc",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   contentTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 8,
//     color: "#0f172a",
//   },
//   contentText: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: "#64748b",
//   },
// });
