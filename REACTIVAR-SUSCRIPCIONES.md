# 🔄 Reactivar Sistema de Suscripciones

⚠️ **IMPORTANTE**: El sistema de suscripciones está temporalmente desactivado para testing.

## ¿Qué fue desactivado?

1. **Verificación de acceso a features premium** - Todos los usuarios tienen acceso ilimitado
2. **PremiumGuard wrappers** - Removidos de Reports e Invoices
3. **TrialBanner** - Oculto en todas las pantallas
4. **Opción de suscripciones en Settings** - Comentada

## ✅ Para reactivar el sistema completo:

### Opción 1: Revertir el commit temporal

```bash
# Ver el commit temporal
git log --oneline | grep "temp: desactivar sistema"

# Revertir el commit (esto creará un nuevo commit que deshace los cambios)
git revert 1a87e14

# O si prefieres hacer reset (⚠️ esto elimina el commit)
git reset --hard HEAD~1
```

### Opción 2: Cambios manuales

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

- ✅ `core/subscription/SubscriptionContext.tsx`
- ✅ `app/(app)/reports/index.tsx`
- ✅ `app/(app)/invoices/index.tsx`
- ✅ `app/(app)/settings/index.tsx`

Todos los cambios están marcados con comentarios `⚠️ TEMPORARY` para fácil identificación.

## ⚙️ Configuración de RevenueCat

Recuerda que también necesitas configurar las API keys en `app/_layout.tsx`:

```typescript
const REVENUE_CAT_IOS_KEY = 'appl_YOUR_REAL_IOS_KEY';
const REVENUE_CAT_ANDROID_KEY = 'goog_YOUR_REAL_ANDROID_KEY';
```

---

**Fecha de desactivación**: 4 de marzo de 2026
**Commit de desactivación**: `1a87e14`
**Razón**: Testing de la app sin restricciones de suscripción
