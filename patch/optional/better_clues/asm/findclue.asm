PHP
TYA
PHA
TXA
PHA
LDA $7f
TAX
LDA $7100,X   ; we've already got this source of clue
BEQ CHECKS
STA $7f
BNE END

Checks
JSR <%= loop_loc %>



END 

PLA
TAX
PLA
TAY
PLP
JMP $DF42
