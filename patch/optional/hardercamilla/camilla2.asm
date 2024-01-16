LDA $50
CMP #$6
BNE ENDprojectile
LDA $30
CMP #$01
BNE ENDprojectile
LDA $51
CMP #$02
BNE ENDprojectile
LDA #$6
LDY #$0
LSR A
TAY
LDA #$59
RTS

endprojectile
LDA $50
LSR A
TAY
LDA ($08),Y
RTS
