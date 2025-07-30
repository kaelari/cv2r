LDA $7f

CMP #$11
BNE A_25
<%= value_11%>
LDA $7f
A_25

CMP #$25
BNE A_14
<%= value_25%>
LDA $7f
A_14

CMP #$14
BNE A_24
<%= value_14%>
LDA $7f
A_24

CMP #$24
BNE A_23
<%= value_24%>
LDA $7f
A_23

CMP #$23
BNE A_22
<%= value_23%>
LDA $7f
A_22

CMP #$22
BNE A_21
<%= value_22%>
LDA $7f
A_21


CMP #$21
BNE A_5C
<%= value_21%>
LDA $7f
A_5C


CMP #$5C
BNE A_0D
<%= value_5C%>
LDA $7f
A_0D

CMP #$0D
BNE A_42
<%= value_0D%>
LDA $7f
A_42

CMP #$42
BNE A_1E
<%= value_42%>
LDA $7f
A_1E

CMP #$1E
BNE A_1f
<%= value_1E%>
LDA $7f
A_1F

CMP #$1F
BNE A_20
<%= value_1F%>
LDA $7f
A_20

CMP #$20
BNE DONE
<%= value_20%>
LDA $7f


DONE
JMP $DF42
