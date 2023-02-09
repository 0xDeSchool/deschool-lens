# descripbe the relationship of userinfo between lens and dechool with connect wallet steps

```mermaid
graph TD
    A[Connect] -->|Login by Lens API| B[Get ProfileInfo and Handle]
    B --> C[Connect from Deschool]
    C -->|MetaMask| D[Deschool UserId]
    C -->|UniPass| D
    D -->|Deschool API| E[User SBT Records info]
    E -->F[Genarate Resume Graph]
```
