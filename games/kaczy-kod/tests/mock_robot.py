"""Protocol-level test; no Microduck, radio or physical hardware is accessed."""
import json, os, socket, subprocess, sys, tempfile, threading, time
script = sys.argv[1]
with tempfile.TemporaryDirectory() as folder:
    path = os.path.join(folder, 'robotd.sock')
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(path)
    server.listen(1)
    messages = []
    failures = []
    def serve():
        try:
            conn, _ = server.accept()
            with conn, conn.makefile('rb') as reader:
                for line in reader:
                    message = json.loads(line)
                    messages.append((time.monotonic(), message))
                    if 'id' in message:
                        result = {'api_version': 1} if message['method'] == 'hello' else {'accepted': True}
                        conn.sendall((json.dumps({'jsonrpc': '2.0', 'id': message['id'], 'result': result}) + '\n').encode())
        except Exception as e:
            failures.append(e)
    thread = threading.Thread(target=serve, daemon=True)
    thread.start()
    result = subprocess.run([sys.executable, script, '--run', '--socket', path], capture_output=True, text=True, timeout=10)
    thread.join(timeout=3)
    server.close()
    assert result.returncode == 0, result.stderr
    assert not failures, failures
    calls = [m for _, m in messages]
    assert calls[0]['method'] == 'hello'
    moves = [(t, m) for t, m in messages if m['method'] == 'robot.move']
    assert 15 <= len(moves) <= 25, len(moves)
    assert all('id' not in m and m['params'] == {'vx': 0.08, 'vy': 0, 'vyaw': 0} for _, m in moves)
    assert 0.85 < moves[-1][0] - moves[0][0] < 1.5
    assert any(m['method'] == 'robot.sound' and m['params']['tag'] == 'chirp' for m in calls)
    assert calls[-1]['method'] == 'robot.stop'
print('Mock robot protocol passed; motion notifications at 20 Hz; final robot.stop.')
