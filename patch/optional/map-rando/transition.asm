; LDA $c1
; STA $600A

; LDA #$03
; JSR $C183
LDA #$7d
;ADC $324
STA $324
LDA #$00
STA $56
STA $57


; LDA #$ff
; STA $324
;LDA #$ff
;STA $89
; LDA #$600A
; JSR $C183
;JSR $D21C
dey
dey
jmp $D109
