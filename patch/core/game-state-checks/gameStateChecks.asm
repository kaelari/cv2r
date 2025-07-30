LDA $6090
CMP #01
BEQ UNPAUS

; inventory game state
LDA *$26
CMP #$01
BNE JWARP
; quest items selected in inventory
;LDA *$33
;BNE DONE

; b pressed
LDA *$F1
CMP #$40
BNE DONE
; deselect quest item
LDA *$33
CMP #$01
BEQ weapondeselect
LDA #$00
STA *$4F
BEQ DONE
weapondeselect
LDA #$00
STA *$90
BEQ DONE

; select pause game state
JWARP CMP #$02
BNE DONE

; up+a+b pressed
LDA *$F1
CMP #$C8
BEQ UNPAUS

CMP #$C4
BEQ UPGRAD

DONE RTS

<%=downab%>

; unpause game
UNPAUS LDA #$00
STA *$26

; flag warp
LDA #$01
STA $600F

; setup warp sound
LDA #$2D
STA *$B4
LDA #$A5
STA *$BA
LDA #$85
STA *$C0
LDA #$01
STA *$C6
STA *$AE

; pop return address and reset flags
PLA
PLA
PLP

; diamond warp flag set?
LDA $6006
BEQ DOJW

; diamond equipped?
LDA *$90
CMP #$05
BNE DOJW

; cross in inventory?
LDA *$92
AND #$02
BEQ DOJW

; setup location and simon positioning for diamond warp
LDA #$03
STA $6007
LDA #$14
STA $6008
LDA #$23
STA $6009
LDA #$C0
STA $600A
LDA #$02
STA *$30
STA *$51
LDA #$09
STA *$50
LDA #$00
STA $600B
STA *$8E
BEQ DOJUMP

; setup location and simon position for jova warp
DOJW
LDA #$0D
STA $600B
LDA #$00
STA $6090
STA *$30
STA *$50
STA *$51
STA *$8E
STA $6007
STA $6008
STA $6009
LDA #$8F
STA $600A

; transition code
DOJUMP
JMP $CF8C

; DONE RTS
