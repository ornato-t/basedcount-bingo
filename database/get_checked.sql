SELECT id,text,position,time,url
FROM v_box_in_card
WHERE checked=true AND token=''
ORDER BY POSITION ASC
