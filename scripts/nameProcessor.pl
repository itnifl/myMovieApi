#!/usr/bin/perl -w
#Creator: Atle Holm - atle@team-holm.net
use strict;



my $name = $ARGV[0];
print nameProcessor($name);

sub nameProcessor {
	#This sub takes a somewhat mangled moviename and tries to make sense of it based on what mangled movienames usually look like
	my $movieName = shift;
	my $oldMovieName = $movieName;
	my @movieValues;
	if(index($movieName, ".") != -1) { @movieValues = split('\.', $movieName); }
	elsif(index($movieName, " ") != -1) { @movieValues = split(' ', $movieName); }
	else {
		$movieName = removeNoiseWords(lc($movieName));
		push(@movieValues, $movieName);
	}
	#print "1- " . $movieName . "\n";
	$movieName = "";
	foreach my $val (@movieValues) {
		if(checkFileEnding($val)) {
			next;
		}
		if($val !~ /\[/ && $val !~ /\(/) {
			$val = getAllAfterCharacterInString("]", $val) if($val =~ /\]/); 
			$val = getAllAfterCharacterInString(")", $val) if($val =~ /\)/); 
			#print "a- " . $val. "\n";
			#if(checkMovieName(lc($val))) { $movieName .= $val . " "; }
			$movieName .= $val . " ";
			#print "b- " . $movieName . "\n";
		} elsif($val =~ /\[/) {
			my $characterIndex = index($val, "[");
			my $subMovieName = substr $val,  0, $characterIndex;
			$subMovieName .=  " " . getAllAfterCharacterInString("]", $val) if($val =~ /\]/);
			$subMovieName =~ s/\s+$//; #remove trailing spaces
			if(checkMovieName(lc($subMovieName))) {
				$movieName .= $subMovieName;
				$movieName .= " ";
			}
		} elsif($val =~ /\(/) {
			my $characterIndex = index($val, "(");
			my $subMovieName = substr $val,  0, $characterIndex;
			$subMovieName .=  " " . getAllAfterCharacterInString(")", $val) if($val =~ /\)/);
			if(checkMovieName(lc($subMovieName))) {
				$movieName .= $subMovieName;
				$movieName .= " ";
			}
		} 
	}
	#print "2- " .$movieName . "\n";
	$movieName = removeNoiseWords(lc($movieName));
	#print "3- " .$movieName . "\n";
	if(!$movieName || $movieName eq ""){
		$movieName = removeNoiseWords(lc($oldMovieName));
		return $oldMovieName if(!$movieName || $movieName eq "");
		return $movieName;
	}
	return $movieName;
}
1;
sub getAllAfterCharacterInString {
	#Takes a character and a string. Returns everything in the string after the character.
	my $character = shift;
	my $val = shift;
	my $characterIndex = index($val, $character);
	my $afterClosingBracket = substr $val, $characterIndex, length($val);
	$afterClosingBracket =~ s/^\s+//; #remove leading spaces
	return $afterClosingBracket if(checkMovieName(lc($afterClosingBracket)));
	return "";
}
sub checkMovieName {
	my $subMovieName = shift;
	return 1 if (($subMovieName !~ /\bppvrip\b/) && ($subMovieName !~ /\b\d{4}\b$/) && ($subMovieName !~ /\bbdrip\b/) && ($subMovieName !~ /\bdvdrip\b/) && ($subMovieName !~ /\beng\b/) && ($subMovieName !~ /\bdivx\b/) && ($subMovieName !~ /\bxvid\b/) && ($subMovieName !~ /\br5\b/) && ($subMovieName !~ /\bline\b/) && ($subMovieName !~ /\baxxo\b/) && ($subMovieName !~ /\bax3\b/) && ($subMovieName !~ /\bac3\b/) && ($subMovieName !~ /\bswesub\b/) && ($subMovieName !~ /\bcom\b/) && ($subMovieName !~ /\btorrentday\b/) && ($subMovieName !~ /\bpiratebay\b/) && ($subMovieName !~ /\bproper\b/) && ($subMovieName !~ /\bdvdscr\b/) && ($subMovieName !~ /\blimited\b/) && ($subMovieName !~ /\b3li\b/) && ($subMovieName !~ /\bfxg\b/) && ($subMovieName !~ /\bepisode\b/) && ($subMovieName !~ /\bnicemaniac\b/));
	return 0;
}
sub removeNoiseWords {
	my $subMovieName = shift;
	$subMovieName =~ s/\bnydic\b//;
	$subMovieName =~ s/cr1spy//;
	$subMovieName =~ s/\betrg\b//;
	$subMovieName =~ s/\bklaxxon\b//;
	$subMovieName =~ s/\bscreener\b//;
	$subMovieName =~ s/\bdvd\b//;
	$subMovieName =~ s/\bhdrip\b//;
	$subMovieName =~ s/\bppvrip\b//;
	$subMovieName =~ s/\bbdrip\b//;
	$subMovieName =~ s/\bbrrip\b//;
	$subMovieName =~ s/\bdvdrip\b//;
	$subMovieName =~ s/\beng\b//;
	$subMovieName =~ s/\bdivx\b//;
	$subMovieName =~ s/\bxvid\b//;
	$subMovieName =~ s/\br5\b//;
	$subMovieName =~ s/\bline\b//;
	$subMovieName =~ s/\baxxo\b//;
	$subMovieName =~ s/\bax3\b//;
	$subMovieName =~ s/\bac3\b//;
	$subMovieName =~ s/\bswesub\b//;
	$subMovieName =~ s/\btorrentday\b//;
	$subMovieName =~ s/\bpiratebay\b//;
	$subMovieName =~ s/\bproper\b//;
	$subMovieName =~ s/\bdvdscr\b//;
	$subMovieName =~ s/\blimited\b//;
	$subMovieName =~ s/cdrs//;
	$subMovieName =~ s/\baqos\b//;
	$subMovieName =~ s/\bwebrip\b//;
	$subMovieName =~ s/3li//;
	$subMovieName =~ s/fxg//;
	$subMovieName =~ s/\bseason\b//;
	$subMovieName =~ s/\bepisode\b//;
	$subMovieName =~ s/\bnicemaniac\b//;
	$subMovieName =~ s/\bmaxspeed\b//;
	$subMovieName =~ s/\bpsig\b//;
	$subMovieName =~ s/\bsubs\b//;
	$subMovieName =~ s/\bnl\b//;
	$subMovieName =~ s/1080p//;
	$subMovieName =~ s/\b720p\b//;
	$subMovieName =~ s/\b480p\b//;
	$subMovieName =~ s/\bm-720p\b//;
	$subMovieName =~ s/\b3lt0n\b//;
	$subMovieName =~ s/\bnlt-release\b//;
	$subMovieName =~ s/\bmultilang\b//;
	$subMovieName =~ s/\bmultisub\b//;
	$subMovieName =~ s/\bhighcode\b//;
	$subMovieName =~ s/\b(flac)\b//;
	$subMovieName =~ s/\bedaw\d\d\d\d\b//;
	$subMovieName =~ s/-sparks//;
	$subMovieName =~ s/-blitzkrieg//;
	$subMovieName =~ s/-playxd//;
	$subMovieName =~ s/-nlt//;
	$subMovieName =~ s/\bmp3\b//;
	$subMovieName =~ s/\bmercifulrelease\b//;
	$subMovieName =~ s/\bdts-wiki\b//;
	$subMovieName =~ s/\bx264\b//;
	$subMovieName =~ s/\bdts\b//;
	$subMovieName =~ s/\busabit.com\b//;
	$subMovieName =~ s/\-/ /g;
	$subMovieName =~ s/\[/ /g;
	$subMovieName =~ s/\]//g;
	$subMovieName =~ s/\(/ /g;
	$subMovieName =~ s/\)//g;
	$subMovieName =~ s/\./ /g;

	my @movieValues = split(' ', $subMovieName);
	my $movieName = "";
	foreach my $val (@movieValues) {
		$movieName .= ucfirst($val) . " ";
	}
	$movieName =~ s/^\s+//; #remove leading spaces
	$movieName =~ s/\s+$//; #remove trailing spaces
	return $movieName;
}
sub nameProcessorWithOffset {
	my $movieName = shift;
	$movieName = substr $movieName, getMovieNameOffset();
	return nameProcessor($movieName);
}
sub checkFileEnding {
	my $nameField = shift;
	if(defined($nameField)) {
		return (($nameField =~ m/mpg$/i) || ($nameField =~ m/avi$/i) || ($nameField =~ m/mpeg$/i) || ($nameField =~ m/mkv$/i) || ($nameField =~ m/mp4$/i) || ($nameField =~ m/iso$/i) || ($nameField =~ m/rar\/$/i) || ($nameField =~ m/jar$/i) || ($nameField =~ m/img$/i));
	} else { return 0; }
}