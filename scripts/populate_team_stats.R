library(jsonlite)
library(DBI)
library(RMySQL)

# Team name to abbreviation mapping
team_abbr_map <- list(
  "Arizona Cardinals" = "ARI",
  "Atlanta Falcons" = "ATL",
  "Baltimore Ravens" = "BAL",
  "Buffalo Bills" = "BUF",
  "Carolina Panthers" = "CAR",
  "Chicago Bears" = "CHI",
  "Cincinnati Bengals" = "CIN",
  "Cleveland Browns" = "CLE",
  "Dallas Cowboys" = "DAL",
  "Denver Broncos" = "DEN",
  "Detroit Lions" = "DET",
  "Green Bay Packers" = "GB",
  "Houston Texans" = "HOU",
  "Indianapolis Colts" = "IND",
  "Jacksonville Jaguars" = "JAX",
  "Kansas City Chiefs" = "KC",
  "Las Vegas Raiders" = "LV",
  "Los Angeles Chargers" = "LAC",
  "Los Angeles Rams" = "LAR",
  "Miami Dolphins" = "MIA",
  "Minnesota Vikings" = "MIN",
  "New England Patriots" = "NE",
  "New Orleans Saints" = "NO",
  "New York Giants" = "NYG",
  "New York Jets" = "NYJ",
  "Philadelphia Eagles" = "PHI",
  "Pittsburgh Steelers" = "PIT",
  "San Francisco 49ers" = "SF",
  "Seattle Seahawks" = "SEA",
  "Tampa Bay Buccaneers" = "TB",
  "Tennessee Titans" = "TEN",
  "Washington Commanders" = "WAS"
)

# Read the JSON file
defense_stats <- fromJSON("public/data/team_defense_2024.json")

# Connect to MySQL
con <- dbConnect(RMySQL::MySQL(),
                 dbname = "stat_pulse_analytics_db",
                 host = "stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com",
                 user = "StatadminPULS3",
                 password = "wyjGiz-justo6-gesmyh"
)

# Insert stats into Team_Defense_Stats_2024
for (i in 1:length(defense_stats$team)) {
  team_name <- defense_stats$team[i]
  team_id <- team_abbr_map[[team_name]]
  if (is.null(team_id)) {
    print(paste("No abbreviation mapping for team:", team_name))
    next
  }

  points_allowed <- defense_stats$total_yards_to$points_allowed[i]
  total_yards_allowed <- defense_stats$total_yards_to$yards[i]
  sacks <- defense_stats$advanced_defense$sacks[i]
  turnovers <- defense_stats$total_yards_to$turnovers[i]
  red_zone_pct <- defense_stats$conversions_against$red_zone_percentage[i] / 100 # Convert percentage to decimal
  third_down_pct <- defense_stats$conversions_against$third_down_percentage[i] / 100 # Convert percentage to decimal
  dvoa_rank <- NA # Not available in JSON, set to NA

  query <- sprintf("INSERT INTO Team_Defense_Stats_2024 (team_id, season, points_allowed, total_yards_allowed, sacks, turnovers, red_zone_pct, third_down_pct, dvoa_rank) 
                    VALUES ('%s', 2024, %d, %d, %d, %d, %f, %f, %s)
                    ON DUPLICATE KEY UPDATE 
                    points_allowed = %d, total_yards_allowed = %d, sacks = %d, turnovers = %d, red_zone_pct = %f, third_down_pct = %f, dvoa_rank = %s",
                   team_id, points_allowed, total_yards_allowed, sacks, turnovers, red_zone_pct, third_down_pct, ifelse(is.na(dvoa_rank), "NULL", dvoa_rank),
                   points_allowed, total_yards_allowed, sacks, turnovers, red_zone_pct, third_down_pct, ifelse(is.na(dvoa_rank), "NULL", dvoa_rank))
  dbExecute(con, query)
}

# Verify data
stats_check <- dbGetQuery(con, "SELECT * FROM Team_Defense_Stats_2024 WHERE team_id IN ('PHI', 'ARI')")
print(stats_check)

dbDisconnect(con)
