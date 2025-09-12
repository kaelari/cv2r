
sec
sbc *$<%= CurrentLevel %>
tay
dey


loop
beq done
bmi reduce

increase
asl *$<%= Temp93 %>
dey
bpl loop

reduce
lsr *$<%= Temp93 %>
iny
bne loop

done
lda #$06
cmp *$<%= CurrentLevel %>
rts

