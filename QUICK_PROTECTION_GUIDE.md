# Guía Rápida: Proteger Rutas Restringidas

## 🎯 Objetivo

Aplicar el `PremiumGuard` a las rutas de Companies, Clients, Expenses e Invoices para restringir su acceso según la suscripción del usuario.

## 📝 Pasos a Seguir

### 1. Proteger Companies

Edita `app/(app)/companies/index.tsx`:

```tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function CompaniesScreen() {
  // ... código existente ...
  
  return (
    <PremiumGuard feature={PremiumFeature.COMPANIES}>
      {/* Envuelve todo el contenido de retorno aquí */}
      <ScrollView>
        {/* ... resto del contenido ... */}
      </ScrollView>
    </PremiumGuard>
  );
}
```

### 2. Proteger Clients

Edita `app/(app)/clients/index.tsx`:

```tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function ClientsScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.CLIENTS}>
      {/* Contenido existente */}
    </PremiumGuard>
  );
}
```

### 3. Proteger Expenses

Edita `app/(app)/expenses/index.tsx`:

```tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function ExpensesScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.EXPENSES}>
      {/* Contenido existente */}
    </PremiumGuard>
  );
}
```

### 4. Proteger Invoices

Edita `app/(app)/invoices/index.tsx`:

```tsx
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

export default function InvoicesScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.INVOICES}>
      {/* Contenido existente */}
    </PremiumGuard>
  );
}
```

## 🎨 Agregar Trial Banners (Opcional)

Para mostrar el estado del trial en cada pantalla, agrega el `TrialBanner` después de la navegación:

```tsx
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { PremiumFeature } from '@ascencio/shared';

export default function CompaniesScreen() {
  return (
    <PremiumGuard feature={PremiumFeature.COMPANIES}>
      <View style={{ flex: 1 }}>
        {/* Header/Navigation */}
        
        <TrialBanner 
          feature={PremiumFeature.COMPANIES} 
          style={{ marginHorizontal: 16 }}
        />
        
        {/* Resto del contenido */}
      </View>
    </PremiumGuard>
  );
}
```

## 🔄 Incrementar Uso al Crear Items

Cuando un usuario crea una nueva empresa, cliente, gasto o factura, incrementa el contador:

```tsx
import { useSubscription } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';

function CreateCompanyButton() {
  const { canCreateItem, incrementUsage } = useSubscription();

  const handleCreate = async () => {
    // Verificar si puede crear
    if (!canCreateItem(PremiumFeature.COMPANIES)) {
      // Navegar a subscription
      router.push('/subscription');
      return;
    }

    // Crear la empresa
    await createCompany(...);
    
    // Incrementar contador
    await incrementUsage(PremiumFeature.COMPANIES);
  };

  return <Button onPress={handleCreate}>Crear Empresa</Button>;
}
```

## ✅ Checklist

- [ ] Proteger `app/(app)/companies/index.tsx`
- [ ] Proteger `app/(app)/clients/index.tsx`
- [ ] Proteger `app/(app)/expenses/index.tsx`
- [ ] Proteger `app/(app)/invoices/index.tsx`
- [ ] Agregar `TrialBanner` (opcional)
- [ ] Incrementar uso al crear items
- [ ] Probar flujo completo
- [ ] Verificar que appointments siga libre

## 🧪 Testing

1. **Sin suscripción (nuevo usuario)**:
   - Debe mostrar trial activo
   - Puede crear hasta los límites del trial
   - Al alcanzar límite, muestra paywall

2. **Trial expirado**:
   - Límites reducidos
   - Muestra paywall en Reports
   - Botón de upgrade visible

3. **Con suscripción activa**:
   - Acceso ilimitado a todo
   - No muestra paywall
   - No muestra trial banner

## 📱 Configurar RevenueCat

No olvides configurar las API keys en `app/_layout.tsx`:

```typescript
const REVENUE_CAT_IOS_KEY = 'appl_TU_CLAVE_IOS_AQUI';
const REVENUE_CAT_ANDROID_KEY = 'goog_TU_CLAVE_ANDROID_AQUI';
```

## 🚀 Próximos Pasos

1. Aplicar protección a todas las rutas listadas
2. Configurar productos en RevenueCat dashboard
3. Configurar productos en App Store Connect y Google Play Console
4. Probar en sandbox/testing
5. Desplegar a producción

## 📚 Ver También

- [SUBSCRIPTION_GUIDE.md](./SUBSCRIPTION_GUIDE.md) - Guía completa
- [RevenueCat Dashboard](https://app.revenuecat.com/)
