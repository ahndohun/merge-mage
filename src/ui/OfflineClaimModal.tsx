import { formatNumber } from "./formatNumber"
import type { OfflineClaim } from "./apiClient"

type OfflineClaimModalProps = {
  readonly claim: OfflineClaim | null
  readonly onClose: () => void
}

export function OfflineClaimModal(props: OfflineClaimModalProps) {
  if (props.claim === null) {
    return null
  }

  return (
    <div className="modal-shade" role="presentation">
      <div aria-modal="true" className="modal panel" role="dialog">
        <div className="panel-header">
          <span>OFFLINE CLAIM</span>
          <strong>{formatNumber(props.claim.gold)}</strong>
        </div>
        <div className="modal-actions">
          <button className="btn" data-testid="offline-claim-accept" onClick={props.onClose} type="button">
            CLAIM
          </button>
          <button className="btn" data-testid="offline-claim-close" onClick={props.onClose} type="button">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
