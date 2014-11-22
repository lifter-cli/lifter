#!/bin/bash

count=0
total=100

cursor[0]='|'
cursor[1]='/'
cursor[2]='-'
cursor[3]='\'

pos=0

printf " "

while [[ $count -lt $total ]]
  do
    while [[ $pos -lt 4 ]]
      do
      pos=$(( ( pos + 1 )  % 4 ))
      printf "\b"${cursor[pos]}
      sleep 0.1
    done

    $count=$(( $count + 1  ))

  done





