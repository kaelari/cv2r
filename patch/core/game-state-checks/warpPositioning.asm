LDA #$00
; y_subpixel
STA $336
; simon_y_delta
STA $36C
; simon_?????
STA $37E
; simon_action
STA $3D8
; jump_flag
STA $446

; sets_FC_y_scroll
LDA $600B
STA *$56
; LDA #$03
LDA $6007
STA *$54
; LDA #$14
LDA $6008
STA *$58
; LDA #$23
LDA $6009
STA *$59

; sets_map_pos
LDA #$00
STA *$5C
STA *$57
LDA #$1D
STA *$5D

LDA #$B0
; simon_y_pos
STA $324
; jovah_warp_flag
STA $600F

RTS
