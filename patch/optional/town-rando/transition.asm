CMP #$FC
BEQ clear
CMP #$F5
BEQ veros
CMP #$F6
BEQ yomi
; else
JMP $D0C2

clear
  LDA #$00
  STA $56
  STA $57
  LDA #$FC
  JMP $D0F9

veros
  LDA #<%= verosheight %>
  BNE store_height

yomi
  LDA #<%= yomiheight %>

store_height
  STA $56
  STA $57
  
  CMP #<%= verosheight %>
  BEQ isveros
  LDA #$F6
  JMP $D109

isveros
  LDA #$F5
  JMP $D109


