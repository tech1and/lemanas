// frontend/components/catalog/ProductParams.js
/**
 * Таблица характеристик товара
 * @param {{ params: Object, limit?: number }} props
 */
export function ProductParams({ params, limit }) {
  if (!params || Object.keys(params).length === 0) {
    return (
      <div className="alert alert-info">
        Характеристики товара уточняются
      </div>
    )
  }

  // Фильтруем системные поля и берём лимит
  const entries = Object.entries(params)
    .filter(([key]) => !['platform'].includes(key))
    .slice(0, limit || Infinity)

  return (
    <div className="table-responsive">
      <table className="table table-sm table-borderless mb-0">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th className="text-muted fw-normal" style={{ width: '40%' }}>
                {key}
              </th>
              <td>
                {typeof value === 'boolean' 
                  ? (value ? 'Да' : 'Нет') 
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {limit && Object.keys(params).length > limit && (
        <div className="text-center mt-2">
          <small className="text-muted">
            Показано {limit} из {Object.keys(params).length} характеристик
          </small>
        </div>
      )}
    </div>
  )
}