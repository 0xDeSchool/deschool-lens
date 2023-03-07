import Icon from '@ant-design/icons'
import mirror from '~/assets/icons/mirror.png'
import './index.css'

export function NotFoundIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M152.5 5H7.5C6.1175 5 5 6.1175 5 7.5V152.5C5 153.883 6.1175 155 7.5 155H152.5C153.883 155 155 153.883 155 152.5V7.5C155 6.1175 153.883 5 152.5 5ZM47.5 150V145C47.5 135.352 55.3525 127.5 65 127.5H95C104.647 127.5 112.5 135.352 112.5 145V150H47.5ZM35 100H30V75H35V100ZM40 60H120V122.5H40V60ZM77.5 42.5C77.5 41.12 78.62 40 80 40C81.38 40 82.5 41.12 82.5 42.5C82.5 43.88 81.38 45 80 45C78.62 45 77.5 43.88 77.5 42.5ZM125 75H130V100H125V75ZM150 150H117.5V145C117.5 137.935 114.22 131.628 109.113 127.5H122.5C123.882 127.5 125 126.382 125 125V105H132.5C133.883 105 135 103.882 135 102.5V72.5C135 71.1175 133.883 70 132.5 70H125V57.5C125 56.1175 123.882 55 122.5 55H82.5V49.54C85.4025 48.505 87.5 45.755 87.5 42.5C87.5 38.365 84.135 35 80 35C75.865 35 72.5 38.365 72.5 42.5C72.5 45.755 74.5975 48.505 77.5 49.54V55H37.5C36.1175 55 35 56.1175 35 57.5V70H27.5C26.1175 70 25 71.1175 25 72.5V102.5C25 103.882 26.1175 105 27.5 105H35V125C35 126.382 36.1175 127.5 37.5 127.5H50.8875C45.78 131.628 42.5 137.935 42.5 145V150H10V30H150V150ZM150 25H10V10H150V25Z"
            fill="black"
          />
          <path d="M20 15H15V20H20V15Z" fill="black" />
          <path d="M30 15H25V20H30V15Z" fill="black" />
          <path d="M40 15H35V20H40V15Z" fill="black" />
          <path d="M145 15H70V20H145V15Z" fill="black" />
          <path
            d="M68.2324 94.2674L71.7674 90.7324L64.7849 83.7499L71.7674 76.7674L68.2324 73.2324L61.2499 80.2149L54.2674 73.2324L50.7324 76.7674L57.7149 83.7499L50.7324 90.7324L54.2674 94.2674L61.2499 87.2849L68.2324 94.2674Z"
            fill="black"
          />
          <path
            d="M91.7674 94.2674L98.7499 87.2849L105.732 94.2674L109.267 90.7324L102.285 83.7499L109.267 76.7674L105.732 73.2324L98.7499 80.2149L91.7674 73.2324L88.2324 76.7674L95.2149 83.7499L88.2324 90.7324L91.7674 94.2674Z"
            fill="black"
          />
          <path
            d="M95 117.5C96.3825 117.5 97.5 116.382 97.5 115C97.5 105.352 89.6475 97.5 80 97.5C70.3525 97.5 62.5 105.352 62.5 115C62.5 116.382 63.6175 117.5 65 117.5H95ZM80 102.5C86.0375 102.5 91.0875 106.802 92.2475 112.5H67.75C68.9125 106.802 73.9625 102.5 80 102.5Z"
            fill="black"
          />
        </svg>
      )}
    />
  )
}

export function UserlaneIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 4H21V10H15V4Z" />
          <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12H17C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12H3Z" />
          <path d="M6 10C7.65685 10 9 8.65685 9 7C9 5.34315 7.65685 4 6 4C4.34315 4 3 5.34315 3 7C3 8.65685 4.34315 10 6 10Z" />
        </svg>
      )}
    />
  )
}

export function ArrowDownIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 12.2848V1H9V12.2848L12.5132 9L14 10.3901L8 16L2 10.3901L3.48679 9L7 12.2848Z" />
        </svg>
      )}
    />
  )
}

export function MirrorIcon(props: any) {
  return <Icon {...props} component={() => <img {...props} src={mirror} alt="mirror" />} />
}

export function TelegramIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg {...props} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.58817 8.24205C7.78965 5.54017 11.925 3.75892 13.9941 2.89831C19.9018 0.44109 21.1293 0.014245 21.9295 0.000150281C22.1054 -0.00294969 22.4989 0.0406627 22.7538 0.247476C22.969 0.422105 23.0282 0.658004 23.0565 0.823572C23.0849 0.989139 23.1202 1.36631 23.0921 1.66101C22.772 5.02476 21.3867 13.1877 20.682 16.9551C20.3838 18.5493 19.7966 19.0838 19.2282 19.1361C17.9928 19.2498 17.0548 18.3197 15.8582 17.5354C13.986 16.3081 12.9282 15.5441 11.1108 14.3464C9.01054 12.9624 10.3721 12.2017 11.569 10.9584C11.8823 10.6331 17.3253 5.68226 17.4306 5.23314C17.4438 5.17697 17.4561 4.9676 17.3317 4.85704C17.2073 4.74648 17.0237 4.78429 16.8912 4.81436C16.7034 4.85698 13.7124 6.83392 7.91818 10.7452C7.0692 11.3282 6.30021 11.6122 5.61122 11.5973C4.85167 11.5809 3.39059 11.1679 2.30444 10.8148C0.972217 10.3818 -0.0866027 10.1528 0.00559677 9.41735C0.0536199 9.03427 0.581144 8.64251 1.58817 8.24205Z"
            fill="currentColor"
          />
        </svg>
      )}
    />
  )
}



export function CyberConnectIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg {...props} viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.8194 14.1385L29.6618 23.2918C29.768 23.4001 29.8525 23.529 29.9105 23.6712C29.9685 23.8133 29.9989 23.9659 30 24.1202C30.001 24.2745 29.9727 24.4275 29.9165 24.5705C29.8604 24.7135 29.7777 24.8436 29.673 24.9535L29.0242 25.6228C28.8418 25.8206 28.601 25.9497 28.3397 25.9897C28.1672 26.0136 27.9917 25.9958 27.8269 25.9377C27.6621 25.8797 27.5126 25.7829 27.3899 25.6551L16.5922 14.4778C16.4045 14.2838 16.2556 14.0534 16.1539 13.7997C16.0523 13.5461 16 13.2742 16 12.9996C16 12.725 16.0523 12.4531 16.1539 12.1994C16.2556 11.9458 16.4045 11.7153 16.5922 11.5213L27.3899 0.344062C27.4951 0.234991 27.62 0.148459 27.7576 0.0894208C27.8951 0.0303825 28.0425 0 28.1914 0C28.3403 0 28.4877 0.0303825 28.6253 0.0894208C28.7628 0.148459 28.8878 0.234991 28.993 0.344062L29.6618 1.04798C29.7672 1.15687 29.8508 1.2862 29.9078 1.42856C29.9648 1.57093 29.9942 1.72354 29.9942 1.87767C29.9942 2.03179 29.9648 2.1844 29.9078 2.32677C29.8508 2.46914 29.7672 2.59848 29.6618 2.70738L20.8194 11.8629C20.5294 12.1655 20.3667 12.5745 20.3667 13.0007C20.3667 13.427 20.5294 13.8359 20.8194 14.1385ZM9.18017 11.8726L0.341223 2.71698C0.233969 2.60853 0.148579 2.47911 0.0900066 2.33622C0.0314344 2.19333 0.000846637 2.03982 1.73272e-05 1.88459C-0.000811983 1.72936 0.0281358 1.5755 0.0851776 1.43194C0.142219 1.28839 0.226225 1.158 0.332313 1.04833L0.978629 0.376712C1.16268 0.180155 1.40373 0.0512975 1.66506 0.00975571C1.83749 -0.0133774 2.01275 0.00476068 2.17734 0.0627778C2.34194 0.120795 2.49149 0.217133 2.61448 0.344398L13.408 11.5218C13.5957 11.7158 13.7445 11.9463 13.8461 12.1999C13.9477 12.4536 14 12.7255 14 13.0001C14 13.2747 13.9477 13.5466 13.8461 13.8002C13.7445 14.0539 13.5957 14.2843 13.408 14.4783L2.61448 25.6557C2.50913 25.7649 2.38405 25.8515 2.24639 25.9105C2.10872 25.9696 1.96117 26 1.81215 26C1.66314 26 1.51558 25.9696 1.37792 25.9105C1.24025 25.8515 1.11517 25.7649 1.00983 25.6557L0.341223 24.9634C0.235829 24.8543 0.152224 24.7247 0.0951824 24.5822C0.038141 24.4396 0.00878432 24.2868 0.00878432 24.1325C0.00878432 23.9782 0.038141 23.8254 0.0951824 23.6828C0.152224 23.5402 0.235829 23.4107 0.341223 23.3016L9.18017 14.1483C9.47006 13.8457 9.63272 13.4367 9.63272 13.0104C9.63272 12.5842 9.47006 12.1752 9.18017 11.8726Z"
            fill="currentColor"
          />
        </svg>
      )}
    />
  )
}

export function DeschoolIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg {...props} viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.8194 14.1385L29.6618 23.2918C29.768 23.4001 29.8525 23.529 29.9105 23.6712C29.9685 23.8133 29.9989 23.9659 30 24.1202C30.001 24.2745 29.9727 24.4275 29.9165 24.5705C29.8604 24.7135 29.7777 24.8436 29.673 24.9535L29.0242 25.6228C28.8418 25.8206 28.601 25.9497 28.3397 25.9897C28.1672 26.0136 27.9917 25.9958 27.8269 25.9377C27.6621 25.8797 27.5126 25.7829 27.3899 25.6551L16.5922 14.4778C16.4045 14.2838 16.2556 14.0534 16.1539 13.7997C16.0523 13.5461 16 13.2742 16 12.9996C16 12.725 16.0523 12.4531 16.1539 12.1994C16.2556 11.9458 16.4045 11.7153 16.5922 11.5213L27.3899 0.344062C27.4951 0.234991 27.62 0.148459 27.7576 0.0894208C27.8951 0.0303825 28.0425 0 28.1914 0C28.3403 0 28.4877 0.0303825 28.6253 0.0894208C28.7628 0.148459 28.8878 0.234991 28.993 0.344062L29.6618 1.04798C29.7672 1.15687 29.8508 1.2862 29.9078 1.42856C29.9648 1.57093 29.9942 1.72354 29.9942 1.87767C29.9942 2.03179 29.9648 2.1844 29.9078 2.32677C29.8508 2.46914 29.7672 2.59848 29.6618 2.70738L20.8194 11.8629C20.5294 12.1655 20.3667 12.5745 20.3667 13.0007C20.3667 13.427 20.5294 13.8359 20.8194 14.1385ZM9.18017 11.8726L0.341223 2.71698C0.233969 2.60853 0.148579 2.47911 0.0900066 2.33622C0.0314344 2.19333 0.000846637 2.03982 1.73272e-05 1.88459C-0.000811983 1.72936 0.0281358 1.5755 0.0851776 1.43194C0.142219 1.28839 0.226225 1.158 0.332313 1.04833L0.978629 0.376712C1.16268 0.180155 1.40373 0.0512975 1.66506 0.00975571C1.83749 -0.0133774 2.01275 0.00476068 2.17734 0.0627778C2.34194 0.120795 2.49149 0.217133 2.61448 0.344398L13.408 11.5218C13.5957 11.7158 13.7445 11.9463 13.8461 12.1999C13.9477 12.4536 14 12.7255 14 13.0001C14 13.2747 13.9477 13.5466 13.8461 13.8002C13.7445 14.0539 13.5957 14.2843 13.408 14.4783L2.61448 25.6557C2.50913 25.7649 2.38405 25.8515 2.24639 25.9105C2.10872 25.9696 1.96117 26 1.81215 26C1.66314 26 1.51558 25.9696 1.37792 25.9105C1.24025 25.8515 1.11517 25.7649 1.00983 25.6557L0.341223 24.9634C0.235829 24.8543 0.152224 24.7247 0.0951824 24.5822C0.038141 24.4396 0.00878432 24.2868 0.00878432 24.1325C0.00878432 23.9782 0.038141 23.8254 0.0951824 23.6828C0.152224 23.5402 0.235829 23.4107 0.341223 23.3016L9.18017 14.1483C9.47006 13.8457 9.63272 13.4367 9.63272 13.0104C9.63272 12.5842 9.47006 12.1752 9.18017 11.8726Z"
            fill="currentColor"
          />
        </svg>
      )}
    />
  )
}

export function LensIcon(props: any) {
  return (
    <Icon
      {...props}
      component={() => (
        <svg {...props} viewBox="0 0 381.55 381.55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M241.5 101.77c-1.06 1.06-2.06 2.14-3.08 3.21 0-1.48.09-3 .09-4.45s0-3.08-.07-4.6c-1.74-63.12-96.88-63.12-98.62 0 0 1.52-.06 3-.06 4.6s.05 3 .09 4.45c-1-1.07-2-2.15-3.09-3.21s-2.19-2.16-3.29-3.21C87.6 55.16 20.33 122.43 63.73 168.3q1.58 1.65 3.21 3.29C119.31 224 189.13 224 189.13 224s69.83 0 122.2-52.37q1.64-1.64 3.21-3.29c43.4-45.87-23.87-113.14-69.74-69.74q-1.66 1.54-3.3 3.17z" stroke-miterlimit="10" stroke-width="11" fill="none" stroke="#00501e" />
          <path className="cls-3" d="M118.4 171.2c0-14.14 13.36-25.61 29.84-25.61s29.84 11.47 29.84 25.61" />
          <circle className="cls-1" cx="157.44" cy="159.86" r="11.51" />
          <path className="cls-3" d="M200.46 171.2c0-14.14 13.36-25.61 29.84-25.61s29.84 11.47 29.84 25.61" />
          <circle className="cls-1" cx="239.51" cy="159.86" r="11.51" />
          <path className="cls-3" d="M207.84 186.35c-3.3 6.05-10.44 10.26-18.74 10.26s-15.44-4.21-18.74-10.26" />
          <path className="cls-1" d="M332.1 310.44a99.88 99.88 0 01-63.39 6.61 98.15 98.15 0 01-52.59-31.15c1.36 1 2.76 1.85 4.19 2.72a74.1 74.1 0 0038.28 10.76 73.21 73.21 0 0034.29-8.57c.76-.4 1.53-.82 2.29-1.25l-5.44-9.56-2 1.09a62.31 62.31 0 01-61.75-1.9A64 64 0 01194.73 224v-4.24h-11.1V224a63.94 63.94 0 01-31.25 55.17 62.31 62.31 0 01-61.75 1.9l-2-1.09-5.44 9.56c.76.43 1.52.85 2.29 1.25a73.21 73.21 0 0034.29 8.57 74 74 0 0038.27-10.76c1.44-.87 2.84-1.77 4.2-2.72a98.19 98.19 0 01-52.59 31.15 99.87 99.87 0 01-63.39-6.61L40.74 320a111 111 0 0071.34 7.78A109.26 109.26 0 00174 289.06a93.38 93.38 0 009.66-14.78v56.2h11v-56.39a94.47 94.47 0 009.76 15 109.28 109.28 0 0061.9 38.73 111 111 0 0071.31-7.82z" />
        </svg>
      )}
    />
  )
}
