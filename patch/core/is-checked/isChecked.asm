PHP
TYA
PHA

LDY #$00

LOOP LDA $6110,Y
CMP #$00
BEQ NOCHK
CMP $7F
BNE NEXT

LDA $6111,Y
CMP *$30
BNE NEXT

LDA $6112,Y
CMP *$50
BNE NEXT

LDA *$51
AND #$7
STA $6000
LDA $6113,Y
CMP $6000
BNE NEXT

LDA #$01
STA $600C
BNE CHKD

NEXT CPY #$80
BEQ NOCHK
INY
INY
INY
INY
BNE LOOP

NOCHK LDA #$00
STA $600C

CHKD
PLA
TAY
PLP

RTS
