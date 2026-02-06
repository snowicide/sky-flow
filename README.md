# SkyFlow - приложение прогноза погоды

## Стек:

- **framework:** Next.js 16.1.4
- **styling:** Tailwind CSS ^4
- **data fetching:** React Query (TanStack Query)
- **language:** TypeScript
- **state management:** Zustand
- **API:** Open-Meteo (Geocoding and Forecast)

## Особенности:

- **умный поиск**: поиск городов с обработкой ошибок
- **детальный прогноз:** текущий, 7-дневной и почасовой прогноз погоды
- **UX/UI:** использование пульсирующих skeleton-компонентов
- **reliability:** полная типизация

## Структура:

- `app/` - основная страница
- `components/` - разделенные UI-компоненты
- `hooks/` - кастомные хуки для работы с API и поисковика
- `services/` - запросы к API
- `types/` - интерфейсы данных
