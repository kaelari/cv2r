;; Check if we're on the correct screen
LDA *$50
CMP #$03
BNE Fail2
;; Check Quest Items
LDA *$91
AND #$00
CMP #$00
BNE Fail1

;; Check Misc Items
LDA *$92
AND #$00
CMP #$00
BNE Fail1

;; Check Subweapons
LDA *$4A
AND #$00
CMP #$00
BNE Fail1

;; All checks passed! Play good sound effect and jump to wallbreak code
PLA
PLA
LDA #$21
JSR $C118
JMP $D672

;; Did not pass checks! Play bad sound effect and return
Fail1
PLA
PLA
LDA #$24
JSR $C118
RTS

Fail2
RTS
    ;; LDA #$03
    ;; STA $4C

    ;; LDA #$20
    ;; JSR $C118
    ;; LDA #$80
    ;; STA $197


    ;; LDA #$04
    ;; STA $30

    ;; LDA #$03
    ;; STA $50
    ;; LDA #$00
    ;; STA $51

    ;; JSR $C5EF

    ;; LDA #$09
    ;; STA $83

    ;; LDA #$0D
    ;; STA $18

    ;; LDA #$00
    ;; STA $2C
