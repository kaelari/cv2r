PHP
TYA
PHA

LDY #$00

CHECK LDA $6110,Y
CMP #$00
BEQ WHIP
CMP *$7F
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

BEQ DONE

NEXT CPY #$80
BEQ WHIP
INY
INY
INY
INY
BNE CHECK

WHIP 
LDA $7F
STA $6110,Y
LDA *$30
STA $6111,Y
LDA *$50
STA $6112,Y
LDA *$51
AND #$7
STA $6113,Y

LDA *$7F
CMP #$26
BEQ MARK
CMP #$1D
BCC MARK
CMP #$38
BCC NOMARK
MARK STA $600E

NOMARK INC <%= ram %>

DONE
PLA
TAY
PLP

LDA $434

RTS
