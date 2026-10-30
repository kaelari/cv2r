; store velocity in temp
STA *$08
; check if camilla is here
; $03B4 is ObjectType list
; 3,4,5 are subweapons, then enemylist starts,
; so $03B4 + 6 = $03BA
LDA $03BA
CMP #$42
BNE normal:

camilla:
; we must skip normal flame bowling ball's init
; so, set actiontype and pose here.
;jsr Object_SetCurrentActionType_And_Y_as_Pose1
LDA #$02
LDY #$7e
JSR $ded0
; ObjectAIvar1,x to 1 to skip more vanilla init
LDA #$01
STA $0444,x
; face left/right as appropriate (*$06 contains encoded angle)
LDA *$06
AND #$10
JSR $e373
STA $0420,x
; set speed to max
LDY #$05
BNE done:

normal:
LDY *$08

done:
LDA *$00
RTS

