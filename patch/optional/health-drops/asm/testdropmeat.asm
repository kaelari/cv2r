and #$0f
bne normal:

meat:
lda #$ef
sta <%= ObjectCurrentPose1 %>,x

normal:
end:
lda #$00
sta <%= ObjectFacingLeft %>,x
rts

