# Sistema de Suscripción con RevenueCat

Este documento describe la implementación del sistema de suscripción in-app utilizando RevenueCat en la aplicación móvil Ascencio Tax.

## 📋 Tabla de Contenidos

- [Configuración](#configuración)
- [Arquitectura](#arquitectura)
- [Uso](#uso)
- [Configuración de Límites](#configuración-de-límites)
- [Protección de Rutas](#protección-de-rutas)
- [Componentes](#componentes)

## 🛠️ Configuración

### 1. Configurar RevenueCat

1. Crea una cuenta en [RevenueCat](https://www.revenuecat.com/)
2. Crea un proyecto nuevo
3. Configura tus productos en App Store Connect (iOS) y Google Play Console (Android)
4. Vincula tus apps en el dashboard de RevenueCat
5. Copia las API Keys:
   - iOS: `appl_XXX...`
   - Android: `goog_XXX...`

### 2. Actualizar las API Keys

Edita el archivo `app/_layout.tsx` y reemplaza las claves:

```typescript
const REVENUE_CAT_IOS_KEY = 'appl_TU_CLAVE_IOS';
const REVENUE_CAT_ANDROID_KEY = 'goog_TU_CLAVE_ANDROID';
```

### 3. Configurar Entitlements en RevenueCat

En el dashboard de RevenueCat, crea un entitlement llamado `premium_features` y asócialo con tus productos.

## 🏗️ Arquitectura

La solución está diseñada para ser centralizada y escalable:

```
ascencio-tax-shared/
└── src/
    └── subscription/
        └── index.ts          # Configuración centralizada, tipos, helpers

ascencio-tax-mobile/
├── core/
│   └── subscription/
│       ├── SubscriptionContext.tsx  # Provider y hook
│       └── index.ts
└── components/
    └── subscription/
        ├── Paywall.tsx              # Pantalla de paywall
        ├── PremiumGuard.tsx         # HOC para proteger rutas
        └── TrialBanner.tsx          # Banner de trial
```

### Paquete Shared

El paquete `@ascencio/shared` contiene toda la configuración centralizada:

- **Tipos**: `SubscriptionTier`, `PremiumFeature`, `SubscriptionStatus`
- **Configuración de límites**: `TRIAL_LIMITS`
- **Helpers**: `canAccessFeature()`, `isWithinTrialLimits()`, `getRemainingItems()`

### Contexto de Suscripción

El `SubscriptionContext` proporciona:

- Estado de suscripción actual
- Información del trial
- Límites de uso
- Métodos para comprar y restaurar suscripciones

## 📝 Uso

### Proteger una Ruta Completa

Usa el componente `PremiumGuard` para envolver toda una pantalla:

```tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function ReportsScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.REPORTS}>
      {/* Tu contenido aquí */}
    </PremiumGuard>
  );
}
```

### Proteger una Función Específica

Usa el hook `useSubscription` para verificar permisos:

```tsx
import { useSubscription } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

function CreateInvoiceButton() {
  const { canCreateItem, incrementUsage } = useSubscription();

  const handleCreate = async () => {
    if (!canCreateItem(PremiumFeature.INVOICES)) {
      // Mostrar paywall
      router.push('/subscription');
      return;
    }

    // Crear la factura
    await createInvoice(...);
    
    // Incrementar el contador de uso
    await incrementUsage(PremiumFeature.INVOICES);
  };

  return <Button onPress={handleCreate}>Crear Factura</Button>;
}
```

### Mostrar Banner de Trial

Agrega el `TrialBanner` a tus pantallas para informar al usuario:

```tsx
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { PremiumFeature } from '@ascencio/shared';

export default function CompaniesScreen() {
  return (
    <View>
      <TrialBanner feature={PremiumFeature.COMPANIES} />
      {/* Resto del contenido */}
    </View>
  );
}
```

## ⚙️ Configuración de Límites

Todos los límites están centralizados en `ascencio-tax-shared/src/subscription/index.ts`:

```typescript
export const TRIAL_LIMITS = {
  // Duración del trial
  TRIAL_DAYS: 7,
  
  // Límites durante el trial
  MAX_COMPANIES: 2,
  MAX_CLIENTS: 5,
  MAX_EXPENSES: 10,
  MAX_INVOICES: 3,
  
  // Límites después del trial sin suscripción
  AFTER_TRIAL_COMPANIES: 1,
  AFTER_TRIAL_CLIENTS: 2,
  AFTER_TRIAL_EXPENSES: 5,
  AFTER_TRIAL_INVOICES: 1,
} as const;
```

### Para Cambiar los Límites:

1. Edita `ascencio-tax-shared/src/subscription/index.ts`
2. Haz commit y push de los cambios
3. Actualiza el paquete en los otros servicios:
   ```bash
   cd ascencio-tax-mobile
   npm update @ascencio/shared
   ```

## 🔒 Protección de Rutas

### Rutas Premium (Requieren Suscripción)

- ✅ **Reports**: Protegida con `PremiumGuard`
- ⚠️ **Companies**: Necesita protección (ver ejemplo abajo)
- ⚠️ **Clients**: Necesita protección
- ⚠️ **Expenses**: Necesita protección
- ⚠️ **Invoices**: Necesita protección

### Rutas Libres

- ✅ **Appointments**: Siempre accesible (generación de citas)

### Ejemplo: Proteger Companies

```tsx
// app/(app)/companies/index.tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function CompaniesScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.COMPANIES}>
      {/* Contenido de la pantalla */}
    </PremiumGuard>
  );
}
```

## 🎨 Componentes

### `<PremiumGuard>`

Protege componentes y muestra paywall si no hay acceso.

**Props:**
- `feature: PremiumFeature` - La función a proteger
- `fallback?: ReactNode` - Componente alternativo (por defecto: Paywall)
- `children: ReactNode` - Contenido a proteger

### `<Paywall>`

Pantalla de paywall que se muestra cuando el usuario no tiene acceso.

**Props:**
- `feature?: PremiumFeature` - Función específica bloqueada
- `onClose?: () => void` - Callback al cerrar (para modales)
- `isModal?: boolean` - Si se muestra como modal

### `<TrialBanner>`

Banner informativo sobre el estado del trial.

**Props:**
- `feature?: PremiumFeature` - Función para mostrar límites
- `style?: ViewStyle` - Estilos personalizados

### `useSubscription()`

Hook para acceder al contexto de suscripción.

**Retorna:**
```typescript
{
  subscriptionStatus: SubscriptionStatus;
  usageLimits: UsageLimits;
  offerings: PurchasesOfferings | null;
  isLoading: boolean;
  
  canAccessFeature: (feature: PremiumFeature) => boolean;
  canCreateItem: (feature: PremiumFeature) => boolean;
  getRemainingItems: (feature: PremiumFeature) => number;
  
  refreshSubscription: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  incrementUsage: (feature: PremiumFeature) => Promise<void>;
}
```

## 🧪 Testing

Para probar sin RevenueCat configurado:

1. Comenta la configuración de RevenueCat en `app/_layout.tsx`
2. Usa estado mock en `SubscriptionContext.tsx`
3. Los límites del trial seguirán funcionando basados en AsyncStorage

## 📱 Configuración de Stores

### iOS (App Store)

1. Crea productos in-app en App Store Connect
2. Configura los productos en RevenueCat
3. Prueba en sandbox con usuarios de prueba

### Android (Google Play)

1. Crea productos in-app en Google Play Console
2. Configura los productos en RevenueCat
3. Prueba con cuentas de prueba autorizadas

## 🚀 Despliegue

Antes de desplegar:

1. ✅ Verifica que las API keys de RevenueCat estén configuradas
2. ✅ Configura los productos en las stores
3. ✅ Prueba el flujo completo de compra
4. ✅ Verifica que los límites funcionen correctamente
5. ✅ Actualiza el paquete shared en todos los servicios

## 🔄 Actualización del Paquete Shared

Cada vez que cambies la configuración en `ascencio-tax-shared`:

```bash
# En ascencio-tax-shared
git add .
git commit -m "Update subscription config"
git push

# En ascencio-tax-mobile
npm update @ascencio/shared
```

## 📚 Recursos

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [RevenueCat React Native SDK](https://docs.revenuecat.com/docs/reactnative)
- [Expo In-App Purchases Tutorial](https://www.revenuecat.com/blog/engineering/expo-in-app-purchase-tutorial/)
- [Video Tutorial](https://www.youtube.com/watch?v=R3fLKC-2Qh0)

## 🤝 Soporte

Para problemas o preguntas sobre la implementación, contacta al equipo de desarrollo.
