CMP #$F5
BEQ veros
CMP #$F6
BEQ yomi
CMP #$FF
BEQ done
JMP $D1F8

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
  JMP $D126

isveros
  LDA #$F5

done
  JMP $D126
