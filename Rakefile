task :default => [:dependencies]

task :dependencies => [:required_tooling] do
  sh "npm install" if online?
end

desc "Run tests (watch)"
task :test => [:dependencies] do
  sh "mocha --harmony -bGwR spec"
end

task :required_tooling do
  ['git', 'npm', 'mocha'].each do |tool|
    next if has_program? tool

    puts "ERROR: Install #{tool}"
    exit 1
  end
end

def has_program?(program)
  ENV['PATH'].split(File::PATH_SEPARATOR).any? do |directory|
    ['', '.exe', '.bat', '.com', '.cmd'].each do |suffix|
      File.executable?(File.join(directory, program.to_s + suffix))
    end
  end
end

def online?
  online = false
  linux_matcher = /^(?<proto>\S+)\s+(?<recvq>\S+)\s+(?<sendq>\S+)\s+(?<local>\S+)\s+(?<foreign>\S+)\s+(?<status>\S+)$/
  win_matcher = /^\s*(?<proto>\S+)\s+(?<local>\S+)\s+(?<foreign>\S+)\s+(?<status>\S+)$/
  pipe 'netstat', '-n' do |line|
    match = linux_matcher.match line
    match = win_matcher.match line if not match
    next if not match

    next if not match[:proto] =~ /^TCP$/i
    next if not match[:status] == 'ESTABLISHED'
    next if match[:foreign].start_with? '127.0.0.1'

    online = true
    break
  end

  if online
    `ping #{if ENV['OS'] == 'Windows_NT' then '-n' else '-c' end} 1 -w 1 google.com`
    online = $? == 0
  end

  puts "Connectivity: #{if online then 'online' else 'offline' end}"
  return online
end

def pipe(*cmd, &block)
  IO.popen(cmd).each_line do |line|
    block.call line unless block.nil?
  end
  err = $?.to_i
  throw "Command failed with status #{err}: #{cmd.join " "}" if err > 0
end
