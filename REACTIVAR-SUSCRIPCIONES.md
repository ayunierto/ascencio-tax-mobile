# 🔄 Reactivar Sistema de Suscripciones

⚠️ **IMPORTANTE**: El sistema de suscripciones está temporalmente desactivado para testing.

## ¿Qué fue desactivado?

1. **Inicialización de RevenueCat SDK** - El SDK no se configura al iniciar la app
2. **Verificación de acceso a features premium** - Todos los usuarios tienen acceso ilimitado
3. **PremiumGuard wrappers** - Removidos de Reports e Invoices
4. **TrialBanner** - Oculto en todas las pantallas
5. **Opción de suscripciones en Settings** - Comentada

## ✅ Para reactivar el sistema completo:

### Opción 1: Revertir todos los commits temporales

```bash
# Ver los commits temporales
git log --oneline | grep "temp:"

# Revertir todos los commits (del más reciente al más antiguo)
git revert ef198cd  # RevenueCat initialization
git revert 1a87e14  # Subscription checks

# O si prefieres hacer reset (⚠️ esto elimina los commits)
git reset --hard HEAD~2
```

### Opción 2: Cambios manuales

#### 0. RevenueCat Initialization (NUEVO)

**Archivo**: `app/_layout.tsx`

```typescript
// Descomentar imports:
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

// Descomentar API keys:
const REVENUE_CAT_IOS_KEY = 'appl_YOUR_IOS_KEY_HERE';
const REVENUE_CAT_ANDROID_KEY = 'goog_YOUR_ANDROID_KEY_HERE';

// Descomentar useEffect:
export default function RootLayout() {
  useEffect(() => {
    // Initialize RevenueCat
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: REVENUE_CAT_IOS_KEY });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: REVENUE_CAT_ANDROID_KEY });
    }

    // Optional: Set log level for debugging
    // Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }, []);
  // ... resto del código
}
```

#### 1. SubscriptionContext.tsx

**Archivo**: `core/subscription/SubscriptionContext.tsx`

```typescript
// Cambiar esta línea de:
const BYPASS_SUBSCRIPTION_CHECKS = true;

// A:
const BYPASS_SUBSCRIPTION_CHECKS = false;
```

#### 2. Reports Screen

**Archivo**: `app/(app)/reports/index.tsx`

```typescript
// Descomentar imports:
import { PremiumGuard } from '@/components/subscription/PremiumGuard';
import { PremiumFeature } from '@ascencio/shared';

// Envolver el return con:
return (
  <PremiumGuard feature={PremiumFeature.REPORTS}>
    {/* contenido existente */}
  </PremiumGuard>
);
```

#### 3. Invoices Screen

**Archivo**: `app/(app)/invoices/index.tsx`

```typescript
// Descomentar imports:
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';
import { TrialBanner } from '@/components/subscription/TrialBanner';

// Envolver con PremiumGuard y agregar TrialBanner
return (
  <PremiumGuard feature={PremiumFeature.INVOICES}>
    <View style={{ flex: 1 }}>
      {/* CustomHeader... */}
      <TrialBanner
        feature={PremiumFeature.INVOICES}
        style={{ marginHorizontal: 16, marginTop: 8 }}
      />
      <InvoicesList />
    </View>
  </PremiumGuard>
);
```

#### 4. Settings Screen

**Archivo**: `app/(app)/settings/index.tsx`

```typescript
// Descomentar la sección de Account:
<View style={styles.section}>
  <ThemedText style={styles.sectionTitle}>{t('account')}</ThemedText>
  <Card>
    <CardContent style={styles.cardContent}>
      <ListItem
        icon="diamond-outline"
        label={t('subscriptions')}
        onPress={() => router.push('/(app)/subscription')}
      />
    </CardContent>
  </Card>
</View>
```

## 🧪 Verificar después de reactivar

```bash
# Verificar compilación TypeScript
npx tsc --noEmit

# Verificar ESLint
npx eslint app components core

# Probar la app
npm start
```

## 📝 Archivos modificados

- ✅ `app/_layout.tsx` (RevenueCat initialization)
- ✅ `core/subscription/SubscriptionContext.tsx` (Bypass checks)
- ✅ `app/(app)/reports/index.tsx` (PremiumGuard removed)
- ✅ `app/(app)/invoices/index.tsx` (PremiumGuard & TrialBanner removed)
- ✅ `app/(app)/settings/index.tsx` (Subscription option hidden)

Todos los cambios están marcados con comentarios `⚠️ TEMPORARY` para fácil identificación.

## ⚙️ Configuración de RevenueCat

Recuerda que también necesitas configurar las API keys reales en `app/_layout.tsx`:

```typescript
const REVENUE_CAT_IOS_KEY = 'appl_YOUR_REAL_IOS_KEY';
const REVENUE_CAT_ANDROID_KEY = 'goog_YOUR_REAL_ANDROID_KEY';
```

---

**Fecha de desactivación**: 5 de marzo de 2026
**Commits de desactivación**:

- `ef198cd` - RevenueCat initialization
- `1a87e14` - Subscription checks

**Razón**: Testing de la app sin restricciones de suscripción ni errores de RevenueCat
