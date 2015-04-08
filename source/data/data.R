####
# This script generates the JSON files required by the 'Commonwealth Games Calculator' JavaScript.
####

# load dependencies
library(XLConnect)
library(sqldf)
library(rjson)

# load data
setwd('~/Sites/bbc/news/special/2014/newsspec_7954/source/data/')
workbook  <- loadWorkbook('cw_games_model.xlsx')
data <- readWorksheet(workbook, sheet = 'result')

data <- sqldf("SELECT * FROM data")

# convert to json
json <- toJSON(as.data.frame(t(data)))

# save manipulated data
write(json, 'processed/data.json')