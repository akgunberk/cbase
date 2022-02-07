# cbase
codebasehq cli for listing and updating tickets.

***

## Authentication
You can find your credentials on codebasehq.com/settings/profile.

    cbase log in 
    
    cbase log out

## Get

#### Base command
Get last 10 tickets assigned to me:

    cbase get
    
By default, assigned tickets are queried. use -a to specify assignee.

    cbase get -a <username>
    
#### Specific Ticket Targeting    
You can get a specific ticket details by providing its id.

    $ cbase get <ticket-id>

#### Ticket Updates    
Get last updates of the ticket as timeline by providing -u option.

    $ gh codebase (ticket|t) <id> -u
        or
    $ gh codebase (ticket|t) <id> -u 5 (Last 5 updates)
    
#### Multiple Word Queries
You can use multiple word queries declaring between "Multiple Word"

    $ cbase get -t "my type"

#### Multiple queries

    $ cbase get -t Bug -p High     (display assigned High priority Bug type tickets)
    
    
*see cbase get -h for other available options*


# Set  

#### Update status:  
    $ gh codebase set <id> -s "In Progress"

#### Update multiple field: (you can use interactive mode: gh codebase t -i)
    $ gh codebase set <id> -s "In Progress" -a berk-akgun


#### Add a comment:  
    $ gh codebase set <id> -C "Who wants to grab a beer after work?"
    
#### Updating multiple fields
    $ gh codebase set <id> -S "(DUPLICATE): ...." -C "Ticket is duplicated, updating it as invalid." -s Invalid

*see cbase get -h for other available options*
