import pandas as pd
df = pd.ExcelFile('java.xlsx')
sheet_names = df.sheet_names
count = len(sheet_names)
i=0
while(i<count):
    data = pd.read_excel('java.xlsx', sheet_name=i)
    FName = sheet_names[i]+'.json'
    f = open(FName, "wt")
    json_str = data.to_json(orient = 'records')
    f.write(json_str)
    f.close()
    i = i+1
 