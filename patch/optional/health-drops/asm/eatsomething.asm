cmp #$ef
beq eatsomething:
rts

eatsomething:
lda #$26
jsr <%= AnyBankPlayTracks %>
lda #$08
sta <%= TempPtr08_lo %>
jsr <%= shoehornedentrypoint %>

pla
pla
jmp <%= Object_Erase_And_IfType3C_Set_42to00 %>

