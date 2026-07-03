import { formatNumber } from "./formatNumber"
import type { OfflineClaim } from "./apiClient"
import { useLocale } from "./useLocale"

type OfflineClaimModalProps = {
  readonly claim: OfflineClaim | null
  readonly onClose: () => void
}

export function OfflineClaimModal(props: OfflineClaimModalProps) {
  const { t } = useLocale()

  if (props.claim === null) {
    return null
  }

  return (
    <div className="modal-shade" role="presentation">
      <div aria-modal="true" className="modal panel" role="dialog">
        <div className="panel-header">
          <span>{t("offlineClaim")}</span>
          <strong>{formatNumber(props.claim.gold)}</strong>
        </div>
        <div className="modal-actions">
          <button className="btn" data-testid="offline-claim-accept" onClick={props.onClose} type="button">
            {t("claim")}
          </button>
          <button className="btn" data-testid="offline-claim-close" onClick={props.onClose} type="button">
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  )
}
