import styles from './styles.module.scss'

export function SubscribeButon(){
    return(
        <button
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    )
}