<?php
// Kickstart the framework
$f3=require('lib/base.php');
#mitchiru_fcxb

header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, X-Custom-Header, Content-Type, Accept");

if ($_SERVER['HTTP_HOST']=='trainingslist.dev') {
    ini_set('display_errors',0);
    error_reporting(E_ALL|E_STRICT);

    $f3->set('DB',new DB\SQL('mysql:host=localhost;port=3306;dbname=fcxb','fcxb','fcxb' ));
    $f3->set('PATH','API/');
    header("Access-Control-Allow-Origin: http://localhost:4200");


} else if ($_SERVER['HTTP_HOST']=='test.fcxb.de') {
    $f3->set('DB',new DB\SQL('mysql:host=localhost;port=3306;dbname=mitchiru_fcxb_test','mitchiru','shee3gie3ohgh4iqu3t' ));
    $f3->set('PATH','');
    header("Access-Control-Allow-Origin: *");

} else {
    $f3->set('DB',new DB\SQL('mysql:host=localhost;port=3306;dbname=mitchiru_fcxb','mitchiru','shee3gie3ohgh4iqu3t' ));
    $f3->set('PATH','');
    header("Access-Control-Allow-Origin: *");
}
$f3->set('DEBUG',1);
$f3->config('config.ini');

date_default_timezone_set('Europe/Berlin');

$f3->route('GET /',
    function($f3) {

        echo json_encode(array(
            'event' => array(
                'GET API/events',
                'GET API/events/@id',
                'POST API/event',
                'POST API/event/@id',
                'DELETE API/event/@id'
            ),
            'user' => array(
                'GET API/users',
                'GET API/users/@ids',
                'GET API/user/@id',
                'GET API/user/@s'
            ),
            'group' => array(
                'GET API/groups'
            ),
            'list' => array(
                'GET API/lists',
                'GET API/list/@id',
                'POST API/list'
            )
        ));
    }
);


$f3->route('GET /statistics',
    function($f3) {
        $f3->set('tue',$f3->get('DB')->exec("
SELECT  count(LOWER(r.user)) as anzahl,
        LOWER(r.user)  as user,
        DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') AS weekday

FROM events e
INNER JOIN registrations r
ON e.id = r.event_id

WHERE DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') = 'Tue'
AND   e.canceled = 0

GROUP BY LOWER(r.user), DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a')
ORDER BY DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a'), count(LOWER(r.user)) DESC
LIMIT 16
"));


$f3->set('fri',$f3->get('DB')->exec("
SELECT  count(LOWER(r.user)) as anzahl,
        LOWER(r.user) as user,
        DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') AS weekday

FROM events e
INNER JOIN registrations r
ON e.id = r.event_id

WHERE DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') = 'Fri'
AND   e.canceled = 0

GROUP BY LOWER(r.user), DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a')
ORDER BY DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a'), count(LOWER(r.user)) DESC
LIMIT 18
"));

$f3->set('match',$f3->get('DB')->exec("
SELECT  count(LOWER(r.user)) as anzahl,
        LOWER(r.user) as user

FROM events e
INNER JOIN registrations r
ON e.id = r.event_id

WHERE e.score != '0:0'
AND   e.canceled = 0

GROUP BY LOWER(r.user)
ORDER BY count(LOWER(r.user)) DESC
LIMIT 12
"));


$output = array(
	'MATCH' => $f3->get('match'),
	'TUE' => $f3->get('tue'),
	'FRI' => $f3->get('fri'),
);

echo (json_encode($output));

    }
);

$f3->route('GET /authenticate',
    function($f3) {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

        $request_body = file_get_contents('php://input');

        if ($request_body) {
            $data = json_decode($request_body);
            if ((is_object($data) && is_object($data->session)) && (($data->session->identification)) ) {
                $tokenCheck = new tokenize();
                $tokenCheck->request_body = $request_body;
                $tokenCheck->authenticate();
                print $tokenCheck->retString;
            } else {
                print '{"session":{"valid":false,"identOrTokenMissing":true}}';
            }
        } else {
            print '{"session":{"valid":false,"noData":true}}<br>';

            //$tokenCheck = new tokenize();
            //.$tokenCheck->generateToken().' <br> '.$tokenCheck->generateGMToken().'<br>'.$tokenCheck->generateTimeToken();
        }

        $f3->set('events',$f3->get('DB')->exec($f3->get('PARAMS.id')));


    }
);




$f3->route('GET /events/@id',
    function($f3) {
        $f3->set('events',$f3->get('DB')->exec('
            SELECT *,
                DATE_FORMAT(FROM_UNIXTIME(evdate), "%a") AS weekday
            FROM events
            WHERE id = '.$f3->get('PARAMS.id')));


        $output = array();
        foreach ($f3->get('events') as $key => $value) {

            //retrieve lists
            $f3->set('lists',$f3->get('DB')->exec('
                    SELECT l.id,
                           l.name
                    FROM event_lists el
                        INNER JOIN lists l
                            ON l.id = el.list_id
                    WHERE el.event_id = '.$value['id'].''));
            $listOutputId = array();
            foreach ($f3->get('lists') as $l_key => $l_value) {
                $output['lists'][] = $l_value;
                $listOutputId[] = $l_value['id'];
            }

            //retrieve users
            $f3->set('users',$f3->get('DB')->exec('
                    SELECT id, user, crdate, pos_x, pos_y, sub, goals, assists
                    FROM registrations eu
                    WHERE eu.event_id = '.$value['id'].''));
            $listOutputUsers = array();
            $listOutputUsersFull = array();

            foreach ($f3->get('users') as $l_key => $l_value) {

                $f3->set('matchesplayed',$f3->get('DB')->exec("
SELECT  count(LOWER(r.user)) as anzahl,
        LOWER(r.user),
        DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') AS weekday,
        SUM(r.goals) as goals_total,
        SUM(r.assists) AS assists_total

FROM events e
INNER JOIN registrations r
ON e.id = r.event_id

WHERE DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') = '".$value['weekday']."'
AND LOWER(r.user) = '".mres($l_value['user'])."'

GROUP BY LOWER(r.user), DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a')
ORDER BY DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a'), count(LOWER(r.user)) DESC"));


                $l_value['id'] = intval($l_value['id']);
                $l_value['pos_y'] = intval($l_value['pos_y']);
                $l_value['pos_x'] = intval($l_value['pos_x']);
                $l_value['goals'] = intval($l_value['goals']);
                $l_value['assists'] = intval($l_value['assists']);
                $l_value['sub'] = ($l_value['sub']?true:false);
                $l_value['crdate'] = intval($l_value['crdate']);
                $l_value['crdate_dif'] = get_time_difference($l_value['crdate']);

                $l_value['mp'] = intval(0);

                foreach ($f3->get('matchesplayed') as $mp_key => $mp_value) {
                    $l_value['goals_total'] = intval($mp_value['goals_total']);
                    $l_value['assists_total'] = intval($mp_value['assists_total']);
                    $l_value['mp'] = intval($mp_value['anzahl']);
                }


                $listOutputUsers[] = $l_value['id'];
                $listOutputUsersFull[] = $l_value;
            }



            $d = array(

                "id" => intval($value['id']),
                "name" => $value['name'],
                "evdate" => intval($value['evdate']),
                "evdate_str" => dateFormat($value['evdate']),
                "ended" => (($value['evdate']+7200)<time()?true:false),
                "weekday" => date("D",$value['evdate']),
                "hour" => date("H:i",$value['evdate']),
                "evdate_dif" => get_time_difference($value['evdate']),
                "sunset" => getSunset($value['evdate']),
                "description" => $value['description'],
                "canceled" => ($value['canceled']?true:false),
                "private" => ($value['private']?true:false),
                "min_att" => intval($value['min_att']),
                "max_att" => intval($value['max_att']),
                "location" => $value['location'],
                "score" => $value['score'],
                "registrations" => $listOutputUsersFull
            );

            $d = array_merge($d,@retrieveWeatherForDay($value['evdate']));

            $output['events'][] = $d;
        }

        echo (json_encode($output));
    }
);

$f3->route('GET /events',
    function($f3) {
        /*
        $f3->set('events',$f3->get('DB')->exec('

        SELECT *,
                CASE WHEN LENGTH(score) > 0 THEN
                    CASE WHEN score != "0:0" THEN evdate END
                ELSE NOW()*2 END AS evdate2,
                DATE_FORMAT(FROM_UNIXTIME(evdate), "%a") AS weekday
        FROM events
        WHERE evdate > '.(time()-(6*3600)).'
        OR    (LENGTH(score) > 0 AND score != "0:0")
        ORDER BY evdate DESC

        '));

        */



        $f3->set('events',$f3->get('DB')->exec('

        SELECT *,
                evdate as evdate2,
                DATE_FORMAT(FROM_UNIXTIME(evdate), "%a") AS weekday,
                false AS oldie
        FROM events
        WHERE evdate > '.(time()-(24*3600)).'
        ORDER BY evdate DESC

        '));

        $f3->set('oldevents',$f3->get('DB')->exec('

        SELECT *,
                (evdate * -1)+NOW() as evdate2,
                DATE_FORMAT(FROM_UNIXTIME(evdate), "%a") AS weekday,
                true AS oldie
        FROM events
        WHERE evdate BETWEEN '.(time()-(24*3600)).' AND '.(time()-(24*3600*10)).'

        AND    (LENGTH(score) > 0 AND score != "0:0")
        ORDER BY evdate ASC

        '));



        $eventsmerge = array();
        foreach ($f3->get('events') as $key => $value) {
            $eventsmerge[] = $value;
        }
        foreach ($f3->get('oldevents') as $key => $value) {
            $eventsmerge[] = $value;
        }

        $output = array('events'=>array());

        foreach ($eventsmerge as $key => $value) {

            //retrieve lists
            $f3->set('lists',$f3->get('DB')->exec('
                        SELECT l.id,
                               l.name
                        FROM event_lists el
                            INNER JOIN lists l
                                ON l.id = el.list_id
                        WHERE el.event_id = '.$value['id'].''));
            $listOutputId = array();
            foreach ($f3->get('lists') as $l_key => $l_value) {
                $output['lists'][] = $l_value;
                $listOutputId[] = $l_value['id'];
            }

            //retrieve users
            $f3->set('users',$f3->get('DB')->exec('
                        SELECT id, user, crdate,pos_x,pos_y,sub,goals,assists
                        FROM registrations eu
                        WHERE eu.event_id = '.$value['id'].''));
            $listOutputUsers = array();
            $listOutputUsersFull = array();

            foreach ($f3->get('users') as $l_key => $l_value) {


                $f3->set('matchesplayed',$f3->get('DB')->exec("
    SELECT  COUNT(LOWER(r.user)) as anzahl,
            LOWER(r.user),
            DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') AS weekday,
            SUM(r.goals) as goals_total,
            SUM(r.assists) AS assists_total

    FROM events e
    INNER JOIN registrations r
    ON e.id = r.event_id

    WHERE DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') = '".$value['weekday']."'
    AND LOWER(r.user) = '".mres($l_value['user'])."'

    GROUP BY LOWER(r.user), DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a')
    ORDER BY DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a'), count(LOWER(r.user)) DESC"));


                $f3->set('goals',$f3->get('DB')->exec("
    SELECT  LOWER(r.user),
            SUM(r.goals) as goals_total,
            SUM(r.assists) AS assists_total

    FROM events e
    INNER JOIN registrations r
    ON e.id = r.event_id

    WHERE DATE_FORMAT(FROM_UNIXTIME(e.evdate), '%a') = '".$value['weekday']."'
    AND LOWER(r.user) = '".mres($l_value['user'])."'

    GROUP BY LOWER(r.user)"));



                $l_value['id'] = intval($l_value['id']);
                $l_value['pos_y'] = intval($l_value['pos_y']);
                $l_value['pos_x'] = intval($l_value['pos_x']);
                $l_value['sub'] = ($l_value['sub']?true:false);
                $l_value['goals'] = intval($l_value['goals']);
                $l_value['assists'] = intval($l_value['assists']);
                $l_value['crdate'] = intval($l_value['crdate']);
                $l_value['crdate_dif'] = get_time_difference($l_value['crdate']);

                $l_value['mp'] = intval(0);

                foreach ($f3->get('matchesplayed') as $mp_key => $mp_value) {
                    $l_value['goals_total'] = intval($mp_value['goals_total']);
                    $l_value['assists_total'] = intval($mp_value['assists_total']);
                    $l_value['mp'] = intval($mp_value['anzahl']);
                }


                $listOutputUsers[] = $l_value['id'];
                $listOutputUsersFull[] = $l_value;
            }

            if ($value['oldie']) {
                //$listOutputUsers = $listOutputUsers;
                //$listOutputUsersFull = $listOutputUsers;
            } else {

            }

            $d = array(
                "id" => intval($value['id']),
                "name" => $value['name'],
                "evdate" => intval($value['evdate2']),
                "evdate_str" => dateFormat($value['evdate']),
                "ended" => (($value['evdate']+7200) < time()?true:false),
                "weekday" => date("D",$value['evdate']),
                "hour" => date("H:i",$value['evdate']),
                "sunset" => getSunset($value['evdate']),
                "evdate_dif" => get_time_difference($value['evdate']),
                "description" => $value['description'],
                "canceled" => ($value['canceled']?true:false),
                "private" => ($value['private']?true:false),
                "min_att" => intval($value['min_att']),
                "max_att" => intval($value['max_att']),
                "location" => $value['location'],
                "score" => $value['score'],
                "registrations" => $listOutputUsersFull
            );

            $d = array_merge($d,@retrieveWeatherForDay($value['evdate']));

            $output['events'][] = $d;
        }

        echo (json_encode($output));
    }
);


$f3->route('GET /templates',
    function($f3) {
        $f3->set('templates',$f3->get('DB')->exec('SELECT * FROM templates'));

        $output = array(
            'templates' => $f3->get('templates')
        );

        echo (json_encode($output));
    }
);

$f3->route('GET /groups',
    function($f3) {
        $f3->set('groups',$f3->get('DB')->exec('SELECT * FROM groups'));

        $output = array(
            'groups' => $f3->get('groups')
        );

        echo (json_encode($output));
    }
);
$f3->route('GET /tallies',
    function($f3) {
        $f3->set('tally',$f3->get('DB')->exec('
SELECT user, SUM(goals) AS goals_total, SUM(assists) AS assists_total, COUNT(goals) AS scored_in_matches
FROM registrations
GROUP BY LOWER(user)
HAVING SUM(goals) + SUM(assists) > 0
ORDER BY SUM(goals) DESC
        '));

        $output = array(
            'tallies' => $f3->get('tally')
        );

        $i=1;
        foreach ($output['tallies'] as &$tally) {
            $tally['id'] = $i;

            $i++;
        }

        echo (json_encode($output));
    }
);

//insert event
$f3->route('POST /events',function($f3) {

    $POST = json_decode(file_get_contents('php://input'));

    if ($POST->event->weekday=='') {
        $POST->event->weekday = 'Mon';
    }


    if ($POST->event->as_template) {
        $f3->get('DB')->exec('INSERT INTO templates (
            name,
            weekday,
            description,
            min_att,
            max_att,
            private,
            location
        ) VALUES (
            "'.mres($POST->event->name).'",
            "'.mres($POST->event->weekday).'",
            "'.mres($POST->event->description).'",
            "'.intval($POST->event->min_att).'",
            "'.intval($POST->event->max_att).'",
            "'.intval($POST->event->private).'",
            "'.mres($POST->event->location).'"
        )');
    }

    $f3->get('DB')->exec('INSERT INTO events (
        name,
        group_id,
        crdate,
        evdate,
        description,
        min_att,
        max_att,
        private,
        location
    ) VALUES (
        "'.mres($POST->event->weekday.' '.$POST->event->name).'",
        "1",
        '.time().',
        '.computeTimeFromString($POST->event->weekday,$POST->event->name).',
        "'.mres($POST->event->description).'",
        "'.intval($POST->event->min_att).'",
        "'.intval($POST->event->max_att).'",
        "'.intval($POST->event->private).'",
        "'.mres($POST->event->location).'"
    )');

    //1 = '.$f3->get('POST.group_id').'

    print file_get_contents('http://'.$_SERVER['HTTP_HOST'].'/'.$f3->get('PATH').'events/'.$f3->get('DB')->lastinsertid());
});

$f3->route('POST /events/@id',function($f3) {

    $POST = json_decode(file_get_contents('php://input'));

    $f3->get('DB')->exec('
        UPDATE events
        SET
            max_att = "'.intval($POST->event->max_att).'",
            name = "'.mres($POST->event->name).'",
            description = "'.mres($POST->event->description).'",
            location = "'.mres($POST->event->location).'",
            private = "'.intval($POST->event->private).'",
            canceled = "'.intval($POST->event->canceled).'",
            score = "'.mres($POST->event->score).'"
        WHERE id = '.intval($f3->get('PARAMS.id')).'
    ');

    print file_get_contents('http://'.$_SERVER['HTTP_HOST'].'/'.$f3->get('PATH').'events/'.$f3->get('PARAMS.id'));
});

$f3->route('DELETE /events/@id',function($f3) {
    //delete event
    $f3->get('DB')->exec('DELETE FROM events WHERE id = '.intval($f3->get('PARAMS.id')));

    echo '{}';
});

$f3->route('DELETE /templates/@id',function($f3) {
    //delete events_template
    $f3->get('DB')->exec('DELETE FROM templates WHERE id = '.intval($f3->get('PARAMS.id')));

    echo '{}';
});

$f3->route('GET /lists',
    function($f3) {
        $f3->set('lists',$f3->get('DB')->exec('SELECT l.id,l.name FROM lists l'));

        $output = array('lists' => $f3->get('lists'));

        echo (json_encode($output));
    }
);

$f3->route('GET /list/@id',
    function($f3) {

        $f3->set('list',$f3->get('DB')->exec('
            SELECT  l.id,
                    l.name
            FROM    lists l
            WHERE l.id = '.$f3->get('PARAMS.id')));


        $usersOutput = array();
        foreach ($f3->get('users') as $l_key => $l_value) {

            $usersOutput[$l_value['id']] = $l_value;
        }
        $listOutput = array(
            'lists' => array(
                'id' => $f3->get('list')[0]['id'],
                'name' => $f3->get('list')[0]['name'],
                'users' => $usersOutput
            )
        );
        echo (json_encode($listOutput));
    }
);

$f3->route('POST /list',function($f3) {
    //insert list
    $f3->get('DB')->exec('
        INSERT INTO lists (name) VALUES ("'.$f3->get('POST.name').'")
    ');
    $f3->reroute('/list/'.$f3->get('DB')->lastinsertid());
});

$f3->route('GET /users?@ids',
    function($f3) {

        $in = '0';
        if ($_GET['ids']) {
            $in = implode(',',$_GET['ids']);
        }


        $f3->set('users',$f3->get('DB')->exec('
            SELECT u.id,
                   u.name,
                   CASE WHEN (u.sms!="" OR u.email !="" OR u.fb!="") THEN 1 ELSE 0 END as vip
            FROM users u
            WHERE u.id IN ('.$in.')

            '));
        $listOutput = array();
        foreach ($f3->get('users') as $l_key => $l_value) {
            $listOutput[$l_value['id']] = $l_value;
        }
        $listOutput = array(
            'users' => $listOutput
        );
        echo (json_encode($listOutput));
    }
);

$f3->route('GET /user/@s',
    function($f3) {

        $f3->set('users',$f3->get('DB')->exec('
            SELECT u.id,
                   u.name,
                   1 AS vip
            FROM users u
            WHERE name LIKE "'.$f3->get('PARAMS.s').'%"
            AND   (u.sms!="" OR u.email !="" OR u.fb!="")
            LIMIT 2

            UNION

            SELECT u.id,
                   u.name,
                   0 AS vip
            FROM users u
            WHERE name LIKE "'.$f3->get('PARAMS.s').'%"
            AND   (u.sms="" AND u.email="" AND u.fb="")
            LIMIT 3

            '));
        $listOutput = array();
        foreach ($f3->get('users') as $l_key => $l_value) {
            $listOutput[$l_value['id']] = $l_value;
        }
        $listOutput = array(
            'users' => $listOutput
        );
        echo (json_encode($listOutput));
    }
);

$f3->route('GET /users/@id',
    function($f3) {
        $f3->set('user',$f3->get('DB')->exec('
            SELECT u.id,
                   u.name,
                   CASE WHEN (u.sms!="" OR u.email !="" OR u.fb!="") THEN 1 ELSE 0 END as vip
            FROM users u
            WHERE u.id = '.$f3->get('PARAMS.id').'

            '));
        $listOutput = array();
        foreach ($f3->get('user') as $l_key => $l_value) {
            $listOutput[] = $l_value;
        }
        $listOutput = array(
            'users' => $listOutput
        );
        echo (json_encode($listOutput));
    }
);


$f3->route('GET /registrations/@id',
    function($f3) {
        $f3->set('user',$f3->get('DB')->exec('
            SELECT r.id,
                   r.user,
                   r.crdate,
                   r.pos_x,
                   r.pos_y,
                   r.goals,
                   r.assists,
                   r.sub,
                   event_id
            FROM registrations r
            WHERE r.id = '.intval($f3->get('PARAMS.id')).'
            ORDER BY crdate DESC

            '));
        $listOutput = array();
        foreach ($f3->get('user') as $l_key => $l_value) {

            $l_value['crdate_dif'] = get_time_difference($l_value['crdate']);

            $listOutput[] = $l_value;
        }
        $listOutput = array(
            'registrations' => $listOutput
        );
        echo (json_encode($listOutput));
    }
);


$f3->route('POST /registrations',
    function($f3) {

        $POST = json_decode(file_get_contents('php://input'));

        $f3->get('DB')->exec('INSERT INTO registrations (
            user,
            event_id,
            crdate
        ) VALUES (
            "'.mres($POST->registration->user).'",
            "'.intval($POST->registration->event).'",
            "'.time().'"
        )');

        //1 = '.$f3->get('POST.group_id').'

        $POST->registration->id = $f3->get('DB')->lastinsertid();

        #{"user":{"first_name":"Han","last_name":"Solo","id":"19"}}
        print json_encode($POST);

        #print file_get_contents('http://'.$_SERVER['HTTP_HOST'].'/'.$f3->get('PATH').'registrations/'.intval($POST->registration->event));
    }
);

$f3->route('POST /registrations/@id',
    function($f3) {

        $POST = json_decode(file_get_contents('php://input'));

        $f3->get('DB')->exec('UPDATE registrations
        SET pos_x = '.intval($POST->registration->pos_x).',
            pos_y = '.intval($POST->registration->pos_y).',
            sub = '.($POST->registration->sub?'true':'false').',
            goals = '.intval($POST->registration->goals).',
            assists = '.intval($POST->registration->assists).',
            chdate = "'.time().'"

         WHERE id = '.intval($f3->get('PARAMS.id'))
        );

        $POST->registration->id = intval($f3->get('PARAMS.id'));

        #{"user":{"first_name":"Han","last_name":"Solo","id":"19"}}
        print json_encode($POST);

        #print file_get_contents('http://'.$_SERVER['HTTP_HOST'].'/'.$f3->get('PATH').'registrations/'.intval($POST->registration->event));
    }
);



$f3->route('DELETE /registrations/@id',
    function($f3) {
        $POST = json_decode(file_get_contents('php://input'));

        $f3->set('event',$f3->get('DB')->exec('
            SELECT event_id
            FROM registrations
            WHERE id = '.intval($f3->get('PARAMS.id')).''));
        $id = 0;
        foreach ($f3->get('event') as $l_key => $l_value) {
            $event_id = $l_value['event_id'];
        }

        $f3->get('DB')->exec('DELETE FROM registrations WHERE id = '.intval($f3->get('PARAMS.id')).'');

        print file_get_contents('http://'.$_SERVER['HTTP_HOST'].'/'.$f3->get('PATH').'registrations/'.intval($event_id));
    }
);




$f3->run();

/* functions */
function computeTimeFromString ($weekday,$timestring) {
    //try to compute the date
    $evdate = 0;

    preg_match('/(0[0-9]|1[0-9]|2[0-3])[:\.]?([0-5][0-9])/', $timestring, $matches);
    preg_match('/([0-9]|1[0-9]|2[0-3])[:\.]?([0-5][0-9])/', $timestring, $matches2);
    if (count($matches) && (strlen($matches[0])==4 || strlen($matches[0])==5)) {
        $time = $matches[0];
    } else if (count($matches2) && (strlen($matches2[0])==4 || strlen($matches2[0])==5)) {
        $time = $matches2[0];
    } else {
        $time = '19.00';
    }

    if (date("D")==$weekday && intval(date('H')) < intval($time)) {
        $next = 'today';
    } else {
        $next = 'next '.$weekday;
    }

    return strtotime($next.' '.$time);
}

function get_time_difference ($eventTime) {

    $today = time();

    // It returns the time difference in Seconds...
    $time_differnce = $eventTime-$today;

    // To Calculate the time difference in Years...
    $years = 60*60*24*365;

    // To Calculate the time difference in Months...
    $months = 60*60*24*30;

    // To Calculate the time difference in Days...
    $days = 60*60*24;

    // To Calculate the time difference in Hours...
    $hours = 60*60;

    // To Calculate the time difference in Minutes...
    $minutes = 60;

    if ($time_differnce > 0) {
        if(intval($time_differnce/$years) > 1) {
            return "starts in ".intval($time_differnce/$years)." years";
        } else if(intval($time_differnce/$years) > 0) {
            return "starts in ".intval($time_differnce/$years)." year";
        } else if(intval($time_differnce/$months) > 1) {
            return "starts in ".intval($time_differnce/$months)." months";
        } else if(intval(($time_differnce/$months)) > 0) {
            return "starts in ".intval(($time_differnce/$months))." month";
        } else if (intval(($time_differnce/$hours)) > 48) {
            $nowTime = intval(date("H"))*3600;
            return "starts in ".intval((($time_differnce+$nowTime)/$days))." days";
        } else if (intval(($time_differnce/$hours)) > 1) {
            return "starts in ".intval(($time_differnce/$hours))." hours";
        } else if (intval(($time_differnce/$hours)) > 0) {
            return "starts in ".intval(($time_differnce/$hours))." hour";
        } else if (intval(($time_differnce/$minutes)) > 1) {
            return "starts in ".intval(($time_differnce/$minutes))." minutes";
        } else {
            return "starts now";
        }
    } else {
        $time_differnce = $time_differnce * -1;

        if(intval($time_differnce/$years) > 1) {
            return intval($time_differnce/$years)." years ago";
        } else if(intval($time_differnce/$years) > 0) {
            return intval($time_differnce/$years)." year ago";
        } else if(intval($time_differnce/$months) > 1) {
            return intval($time_differnce/$months)." months ago";
        } else if(intval(($time_differnce/$months)) > 0) {
            return intval(($time_differnce/$months))." month ago";
        } else if(intval(($time_differnce/$days)) > 1) {
            return intval(($time_differnce/$days))." days ago";
        } else if (intval(($time_differnce/$hours)) > 1) {
            return intval(($time_differnce/$hours))." hours ago";
        } else if (intval(($time_differnce/$hours)) > 0) {
            return intval(($time_differnce/$hours))." hour ago";
        } else if (intval(($time_differnce/$minutes)) > 1) {
            return intval(($time_differnce/$minutes))." min ago";
        } else {
            return $time_differnce.' seconds ago';
        }



        return "in the past";
    }
}
function dateFormat ($time) {
    return date('jS \o\f F \a\t H:i',$time);
}

function mres($value)
{
    $search = array("\\",  "\x00", "\n",  "\r",  "'",  '"', "\x1a");
    $replace = array("\\\\","\\0","\\n", "\\r", "\'", '\"', "\\Z");

    return str_replace($search, $replace, $value);
}

/**
 * Determine if a given string contains a given substring.
 *
 * @param  string  $haystack
 * @param  string|array  $needles
 * @return bool
 */
function str_contains($haystack, $needles)
{
    foreach ((array) $needles as $needle)
    {
        if ($needle != '' && strpos($haystack, $needle) !== false) return true;
    }

    return false;
}

function retrieveWeather () {
    //retrieve weather once a day
    $weatherfile = './tmp/weather.json';
    if (file_exists($weatherfile) && filemtime($weatherfile)>(time()-(3600*24))) {
        $weather = file_get_contents($weatherfile);
    } else {
        @unlink($weatherfile);
        $weather = file_get_contents('http://api.openweathermap.org/data/2.5/forecast/daily?id=7290253&units=metric&cnt=7&APPID=0ec5e24d1dd39fda993df1f48d84311b');
        file_put_contents($weatherfile,$weather);
    }

    return $weather;
}

function retrieveWeatherForDay ($day) {
    $weather = retrieveWeather();


    $weather = json_decode($weather,true);

    $todayWeather = '';

    if (count($weather['list'])) {
        foreach($weather['list'] as $key => $value) {

            if (date('d.m',$value['dt']) == date('d.m',$day)) {
                $todayWeather = $value;
            }
        }
    }

    if (is_array($todayWeather)) {
        $ret = array(
            'weather_icon' => getWeatherIcon($todayWeather['weather'][0]['icon']),
            'weather' => $todayWeather['weather'][0]['description'],
            'weather_wind_speed' => ceil($todayWeather['speed']),
        );

        if (strstr($ret['weather'],'rain')) {
            $ret['weather'] = '% of'."\n". $ret['weather'];
        }

        if (intval(date('H',$day) < 11) ) {
            $ret['weather_temperature'] = ceil($todayWeather['temp']['morn']);
        } else if (intval(date('H',$day) < 15) ) {
            $ret['weather_temperature'] = ceil($todayWeather['temp']['day']);
        } else if (intval(date('H',$day) < 20) ) {
            $ret['weather_temperature'] = ceil($todayWeather['temp']['eve']);
        } else {
            $ret['weather_temperature'] = ceil($todayWeather['temp']['night']);
        }

        return $ret;
    } else {
        return array(
            'weather_temperature' => '',
            'weather' => '',
            'weather_icon' => '',
            'weather_wind_speed' => '',
        );
    }
    //http://openweathermap.org/img/w/10d.png
}

function getWeatherIcon($icon) {
    $iconpath = $icon.'.png';
    //if (!file_exists('./tmp/'.$iconpath)) {
    //    file_put_contents('./tmp/'.$icon.'.png',file_get_contents('http://openweathermap.org/img/w/'.$iconpath));
    //}

    return 'http://'.$_SERVER['HTTP_HOST'].($_SERVER['HTTP_HOST']=='trainingslist.dev'?'/API':'').'/icons/'.$iconpath;
}

function getSunset ($timestamp) {
    $tz = new DateTimeZone('Europe/Berlin');
    $dt = new DateTime("now", $tz);
    $dt->setTimestamp(intval($timestamp));
    $offset =  $dt->getOffset()/3600;
    return date_sunset($timestamp,SUNFUNCS_RET_STRING,52.476929,13.41027,ini_get("date.sunset_zenith"),$offset);
}
